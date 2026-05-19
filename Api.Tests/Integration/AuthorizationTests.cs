using System.Net;
using System.Net.Http.Json;
using Api.Tests.Fixtures;
using Api.Tests.Helpers;

namespace Api.Tests.Integration;

[Collection("Mongo")]
public class AuthorizationTests : IAsyncLifetime
{
    private readonly TestWebAppFactory _factory;
    private readonly HttpClient _userA;
    private readonly HttpClient _userB;

    public AuthorizationTests(MongoFixture fixture)
    {
        _factory = new TestWebAppFactory(fixture);
        _userA = _factory.CreateClient();
        _userB = _factory.CreateClient();
    }

    public async Task InitializeAsync()
    {
        var tokenA = await _userA.RegisterAndLoginAsync(name: "Alice");
        _userA.UseBearer(tokenA);

        var tokenB = await _userB.RegisterAndLoginAsync(name: "Bob");
        _userB.UseBearer(tokenB);
    }

    public async Task DisposeAsync()
    {
        _userA.Dispose();
        _userB.Dispose();
        await _factory.DisposeAsync();
    }

    private static object ValidPayload(string company = "Acme") => new
    {
        CompanyName = company,
        Position = "Engineer",
        ApplicationLink = "https://acme.example.com/jobs/1",
        Status = "Applied",
        Description = "Applied via referral.",
        DateApplied = DateTime.UtcNow.AddDays(-1).ToString("o")
    };

    private async Task<string> CreateAsAsync(HttpClient client)
    {
        var create = await client.PostAsJsonAsync("/api/JobApplication", ValidPayload());
        create.EnsureSuccessStatusCode();
        var body = await create.ReadJsonAsync();
        return body.GetProperty("jobApplication").GetProperty("id").GetString()!;
    }

    [Fact]
    public async Task GetById_OtherUsersApp_Returns404()
    {
        // Alice creates an app; Bob shouldn't be able to read it.
        var aliceAppId = await CreateAsAsync(_userA);

        var response = await _userB.GetAsync($"/api/JobApplication/{aliceAppId}");

        // 404 (not 403) is intentional — prevents existence leakage of other users' resources.
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Update_OtherUsersApp_Returns404()
    {
        var aliceAppId = await CreateAsAsync(_userA);

        var response = await _userB.PutAsJsonAsync(
            $"/api/JobApplication/{aliceAppId}", ValidPayload(company: "HijackedCo"));

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Delete_OtherUsersApp_Returns404()
    {
        var aliceAppId = await CreateAsAsync(_userA);

        var response = await _userB.DeleteAsync($"/api/JobApplication/{aliceAppId}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetAll_ReturnsOnlyOwnApps_NotOtherUsers()
    {
        await CreateAsAsync(_userA); // Alice creates one
        await CreateAsAsync(_userA); // Alice creates another

        // Bob lists his apps — should be empty.
        var response = await _userB.GetAsync("/api/JobApplication");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var body = await response.ReadJsonAsync();
        Assert.Equal(0, body.GetProperty("jobApplications").GetArrayLength());
    }
}
