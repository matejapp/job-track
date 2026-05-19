using System.Net;
using Api.Tests.Fixtures;

namespace Api.Tests.Integration;

[Collection("Mongo")]
public class HealthSmokeTests : IAsyncLifetime
{
    private readonly TestWebAppFactory _factory;
    private readonly HttpClient _client;

    public HealthSmokeTests(MongoFixture fixture)
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

    [Fact]
    public async Task Health_Returns200_AndReportsMongoHealthy()
    {
        var response = await _client.GetAsync("/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains("\"status\":\"Healthy\"", body);
        Assert.Contains("\"name\":\"MongoDB\"", body);
    }
}
