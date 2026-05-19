using Api.Tests.Fixtures;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Api.Tests;

public class TestWebAppFactory : WebApplicationFactory<Program>
{
    private readonly string _mongoConnectionString;
    private readonly string _databaseName = "test_" + Guid.NewGuid().ToString("N");

    public string DatabaseName => _databaseName;

    public TestWebAppFactory(MongoFixture fixture)
    {
        _mongoConnectionString = fixture.ConnectionString;
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.UseSetting("MongoDB:ConnectionString",          _mongoConnectionString);
        builder.UseSetting("MongoDB:DatabaseName",              _databaseName);
        builder.UseSetting("MongoDB:UsersCollection",           "Users");
        builder.UseSetting("MongoDB:JobApplicationsCollection", "JobApplications");
        builder.UseSetting("JWT:SecretKey",                     "test-secret-key-that-is-at-least-32-chars-long-for-hmac-sha256");
    }
}
