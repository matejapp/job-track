using System.Text;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using Api.Middleware;
using Api.Models;
using Api.Repositories;
using Api.Repositories.Interfaces;
using Api.Services;
using Api.Services.Interfaces;
using Api.Shared;
using Api.Validators;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using Serilog;


var builder = WebApplication.CreateBuilder(args);

// Logging
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

// Persistence
var mongoConn = builder.Configuration["MongoDB:ConnectionString"]
    ?? throw new InvalidOperationException("MongoDB:ConnectionString is required");

builder.Services.Configure<MongoDBSettings>(
    builder.Configuration.GetSection("MongoDB")
);
builder.Services.AddSingleton<MongoDBContext>();


// Health checks
builder.Services.AddHealthChecks()
    .AddMongoDb(
        clientFactory: _ => new MongoClient(mongoConn),
        name: "MongoDB",
        timeout: TimeSpan.FromSeconds(3));

// Domain services
builder.Services.AddScoped<IJobApplicationRepository, JobApplicationRepository>();
builder.Services.AddScoped<IJobApplicationService, JobApplicationService>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddSingleton<IJwtTokenService, JwtTokenService>();

// Validation
builder.Services.AddValidatorsFromAssemblyContaining<RegisterDtoValidator>();

// Auth
builder.Services.AddAuthentication(cfg =>
{
    cfg.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    cfg.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    cfg.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(bearer =>
{
    bearer.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
    bearer.SaveToken = false;
    bearer.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:SecretKey"]!)),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero,
    };
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend/", policy =>
        policy.WithOrigins("http://localhost:5173",
                            "https://job-track.app",
                            "https://www.job-track.app")
              .AllowAnyHeader()
              .AllowAnyMethod());


});

// Rate limiting (skipped in Testing env so integration tests don't trip 429s)
if (!builder.Environment.IsEnvironment("Testing"))
{
    builder.Services.AddRateLimiter(options =>
    {
        options.AddSlidingWindowLimiter("SlidingWindow", config =>
        {
            config.Window = TimeSpan.FromSeconds(10);
            config.SegmentsPerWindow = 2;
            config.PermitLimit = 5;
            config.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
            config.QueueLimit = 5;
        });

        options.AddFixedWindowLimiter("FixedWindow", config =>
        {
            config.Window = TimeSpan.FromSeconds(30);
            config.PermitLimit = 5;
            config.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
            config.QueueLimit = 0;
        });
    });
}

// Exception handling
builder.Services.AddExceptionHandler<ExceptionHandlingMiddleware>();
builder.Services.AddProblemDetails();

// API surface
builder.Services.AddControllers().AddJsonOptions(options =>
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var ctx = scope.ServiceProvider.GetRequiredService<MongoDBContext>();
    await ctx.EnsureIndexesAsync();
}


// Pipeline
app.UseExceptionHandler();
app.UseSerilogRequestLogging();

app.UseSwagger();
app.UseSwaggerUI();



app.UseCors("Frontend/", "Frontend/WWW");
app.UseAuthentication();
app.UseAuthorization();
if (!app.Environment.IsEnvironment("Testing"))
{
    app.UseRateLimiter();
}

app.MapControllers();
app.MapHealthChecks("/health", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    ResponseWriter = async (ctx, report) =>
    {
        ctx.Response.ContentType = "application/json";
        await ctx.Response.WriteAsJsonAsync(new
        {
            status = report.Status.ToString(),
            checks = report.Entries.Select(e => new
            {
                name = e.Key,
                status = e.Value.Status.ToString(),
                duration = e.Value.Duration.TotalMilliseconds,
                error = e.Value.Exception?.Message
            })
        });
    }
});


app.Run();


