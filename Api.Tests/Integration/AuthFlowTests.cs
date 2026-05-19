using System.Net;
using System.Net.Http.Json;
using Api.Tests.Fixtures;
using Api.Tests.Helpers;

namespace Api.Tests.Integration;

[Collection("Mongo")]
public class AuthFlowTests : IAsyncLifetime
{
    private readonly TestWebAppFactory _factory;
    private readonly HttpClient _client;

    public AuthFlowTests(MongoFixture fixture)
    {
        _factory = new TestWebAppFactory(fixture);
        _client = _factory.CreateClient();
    }

    public Task InitializeAsync() => Task.CompletedTask;

    public async Task DisposeAsync()
    {
        _client.Dispose();
        await _factory.DisposeAsync();
    }

    // ----- Register -----

    [Fact]
    public async Task Register_ValidPayload_Returns200_AndReturnsUser()
    {
        var response = await _client.PostAsJsonAsync("/api/Auth/register", new
        {
            Name = "Alice",
            Email = $"alice{Guid.NewGuid():N}@example.com",
            Password = "Passw0rd!"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var body = await response.ReadJsonAsync();
        var user = body.GetProperty("user");
        Assert.False(string.IsNullOrEmpty(user.GetProperty("id").GetString()));
        Assert.Equal("Alice", user.GetProperty("name").GetString());
    }

    [Fact]
    public async Task Register_DuplicateEmail_Returns409()
    {
        var email = $"dup{Guid.NewGuid():N}@example.com";
        var payload = new { Name = "Bob", Email = email, Password = "Passw0rd!" };

        var first = await _client.PostAsJsonAsync("/api/Auth/register", payload);
        Assert.Equal(HttpStatusCode.OK, first.StatusCode);

        var second = await _client.PostAsJsonAsync("/api/Auth/register", payload);
        Assert.Equal(HttpStatusCode.Conflict, second.StatusCode);

        var body = await second.ReadJsonAsync();
        Assert.Equal("EMAIL_ALREADY_IN_USE", body.GetProperty("error").GetProperty("code").GetString());
    }

    [Fact]
    public async Task Register_InvalidEmail_Returns400_WithFieldError()
    {
        var response = await _client.PostAsJsonAsync("/api/Auth/register", new
        {
            Name = "Carol",
            Email = "not-an-email",
            Password = "Passw0rd!"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains("Email", body);
    }

    [Fact]
    public async Task Register_WeakPassword_Returns400()
    {
        var response = await _client.PostAsJsonAsync("/api/Auth/register", new
        {
            Name = "Dave",
            Email = $"dave{Guid.NewGuid():N}@example.com",
            Password = "abc"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains("Password", body);
    }

    [Fact]
    public async Task Register_NameWithDigits_Returns400()
    {
        // Validator requires letters-only name (RegisterDtoValidator.isValidName)
        var response = await _client.PostAsJsonAsync("/api/Auth/register", new
        {
            Name = "Eve123",
            Email = $"eve{Guid.NewGuid():N}@example.com",
            Password = "Passw0rd!"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    // ----- Login -----

    [Fact]
    public async Task Login_CorrectCredentials_Returns200_WithJwt()
    {
        var email = $"login{Guid.NewGuid():N}@example.com";
        var password = "Passw0rd!";

        var register = await _client.PostAsJsonAsync("/api/Auth/register",
            new { Name = "Frank", Email = email, Password = password });
        register.EnsureSuccessStatusCode();

        var login = await _client.PostAsJsonAsync("/api/Auth/login",
            new { Email = email, Password = password });

        Assert.Equal(HttpStatusCode.OK, login.StatusCode);

        var body = await login.ReadJsonAsync();
        var token = body.GetProperty("token").GetString();
        Assert.False(string.IsNullOrWhiteSpace(token));
        // JWTs are three dot-separated base64 segments.
        Assert.Equal(2, token!.Count(c => c == '.'));
    }

    [Fact]
    public async Task Login_WrongPassword_Returns401()
    {
        var email = $"wrong{Guid.NewGuid():N}@example.com";

        var register = await _client.PostAsJsonAsync("/api/Auth/register",
            new { Name = "Grace", Email = email, Password = "Passw0rd!" });
        register.EnsureSuccessStatusCode();

        var login = await _client.PostAsJsonAsync("/api/Auth/login",
            new { Email = email, Password = "wrong-password" });

        Assert.Equal(HttpStatusCode.Unauthorized, login.StatusCode);

        var body = await login.ReadJsonAsync();
        Assert.Equal("INVALID_CREDENTIALS", body.GetProperty("error").GetProperty("code").GetString());
    }

    [Fact]
    public async Task Login_NonexistentEmail_Returns401()
    {
        var login = await _client.PostAsJsonAsync("/api/Auth/login", new
        {
            Email = $"ghost{Guid.NewGuid():N}@example.com",
            Password = "Passw0rd!"
        });

        // Same status as wrong-password — prevents user enumeration.
        Assert.Equal(HttpStatusCode.Unauthorized, login.StatusCode);
    }

    // ----- Protected endpoint -----

    [Fact]
    public async Task ProtectedEndpoint_NoToken_Returns401()
    {
        var response = await _client.GetAsync("/api/JobApplication");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task ProtectedEndpoint_ValidToken_Returns200()
    {
        var token = await _client.RegisterAndLoginAsync();
        _client.UseBearer(token);

        var response = await _client.GetAsync("/api/JobApplication");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var body = await response.ReadJsonAsync();
        // A fresh user has no applications; expect empty array.
        Assert.Equal(0, body.GetProperty("jobApplications").GetArrayLength());
    }
}
