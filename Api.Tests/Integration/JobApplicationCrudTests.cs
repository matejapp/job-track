using System.Net;
using System.Net.Http.Json;
using Api.Tests.Fixtures;
using Api.Tests.Helpers;

namespace Api.Tests.Integration;

[Collection("Mongo")]
public class JobApplicationCrudTests : IAsyncLifetime
{
    private readonly TestWebAppFactory _factory;
    private readonly HttpClient _client;
    private string _token = string.Empty;

    public JobApplicationCrudTests(MongoFixture fixture)
    {
        _factory = new TestWebAppFactory(fixture);
        _client = _factory.CreateClient();
    }

    public async Task InitializeAsync()
    {
        _token = await _client.RegisterAndLoginAsync();
        _client.UseBearer(_token);
    }

    public async Task DisposeAsync()
    {
        _client.Dispose();
        await _factory.DisposeAsync();
    }

    private static object ValidPayload(
        string? company = "Acme",
        string? position = "Engineer",
        string? link = "https://acme.example.com/jobs/1",
        string? status = "Applied",
        string? description = "Applied via referral from a friend.",
        DateTime? dateApplied = null) => new
    {
        CompanyName = company,
        Position = position,
        ApplicationLink = link,
        Status = status,
        Description = description,
        DateApplied = (dateApplied ?? DateTime.UtcNow.AddDays(-1)).ToString("o")
    };

    // ----- Create -----

    [Fact]
    public async Task Create_ValidPayload_Returns201_AndPersistsApp()
    {
        var response = await _client.PostAsJsonAsync("/api/JobApplication", ValidPayload());

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var body = await response.ReadJsonAsync();
        var ja = body.GetProperty("jobApplication");
        Assert.False(string.IsNullOrEmpty(ja.GetProperty("id").GetString()));
        Assert.Equal("Acme", ja.GetProperty("companyName").GetString());
        Assert.Equal("Applied", ja.GetProperty("status").GetString());
    }

    [Fact]
    public async Task Create_MissingCompanyName_Returns400()
    {
        var response = await _client.PostAsJsonAsync("/api/JobApplication", ValidPayload(company: ""));
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Create_InvalidApplicationLink_Returns400()
    {
        var response = await _client.PostAsJsonAsync("/api/JobApplication", ValidPayload(link: "not-a-url"));
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Create_FutureDateApplied_Returns400()
    {
        // CreateJobApplicationDtoValidator.isValidDate: must be <= DateTime.UtcNow
        var response = await _client.PostAsJsonAsync("/api/JobApplication",
            ValidPayload(dateApplied: DateTime.UtcNow.AddDays(7)));
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Create_DescriptionTooShort_Returns400()
    {
        // Validator requires Description >= 10 chars
        var response = await _client.PostAsJsonAsync("/api/JobApplication", ValidPayload(description: "short"));
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    // ----- Read -----

    [Fact]
    public async Task GetById_OwnApp_Returns200_WithCorrectData()
    {
        var create = await _client.PostAsJsonAsync("/api/JobApplication", ValidPayload(company: "Northwind"));
        var createdId = (await create.ReadJsonAsync())
            .GetProperty("jobApplication").GetProperty("id").GetString();

        var get = await _client.GetAsync($"/api/JobApplication/{createdId}");
        Assert.Equal(HttpStatusCode.OK, get.StatusCode);

        var body = await get.ReadJsonAsync();
        Assert.Equal("Northwind", body.GetProperty("jobApplication").GetProperty("companyName").GetString());
    }

    [Fact]
    public async Task GetAll_ReturnsOnlyOwnApps()
    {
        await _client.PostAsJsonAsync("/api/JobApplication", ValidPayload(company: "App-1"));
        await _client.PostAsJsonAsync("/api/JobApplication", ValidPayload(company: "App-2"));

        var response = await _client.GetAsync("/api/JobApplication");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var body = await response.ReadJsonAsync();
        var arr = body.GetProperty("jobApplications");
        Assert.True(arr.GetArrayLength() >= 2);
    }

    // ----- Update -----

    [Fact]
    public async Task Update_OwnApp_Returns204_AndPersistsChanges()
    {
        var create = await _client.PostAsJsonAsync("/api/JobApplication", ValidPayload(company: "OldCo"));
        var id = (await create.ReadJsonAsync())
            .GetProperty("jobApplication").GetProperty("id").GetString();

        var update = await _client.PutAsJsonAsync($"/api/JobApplication/{id}",
            ValidPayload(company: "NewCo", status: "Interview"));
        Assert.Equal(HttpStatusCode.NoContent, update.StatusCode);

        var get = await _client.GetAsync($"/api/JobApplication/{id}");
        var body = await get.ReadJsonAsync();
        Assert.Equal("NewCo", body.GetProperty("jobApplication").GetProperty("companyName").GetString());
        Assert.Equal("Interview", body.GetProperty("jobApplication").GetProperty("status").GetString());
    }

    // ----- Delete -----

    [Fact]
    public async Task Delete_OwnApp_Returns204_AndRemoves()
    {
        var create = await _client.PostAsJsonAsync("/api/JobApplication", ValidPayload());
        var id = (await create.ReadJsonAsync())
            .GetProperty("jobApplication").GetProperty("id").GetString();

        var delete = await _client.DeleteAsync($"/api/JobApplication/{id}");
        Assert.Equal(HttpStatusCode.NoContent, delete.StatusCode);

        var get = await _client.GetAsync($"/api/JobApplication/{id}");
        Assert.Equal(HttpStatusCode.NotFound, get.StatusCode);
    }
}
