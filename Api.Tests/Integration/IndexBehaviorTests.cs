using System.Net.Http.Json;
using Api.Models;
using Api.Tests.Fixtures;
using Api.Tests.Helpers;
using MongoDB.Driver;

namespace Api.Tests.Integration;

[Collection("Mongo")]
public class IndexBehaviorTests : IAsyncLifetime
{
    private readonly MongoFixture _fixture;
    private readonly TestWebAppFactory _factory;
    private readonly HttpClient _client;

    public IndexBehaviorTests(MongoFixture fixture)
    {
        _fixture = fixture;
        _factory = new TestWebAppFactory(fixture);
        _client = _factory.CreateClient();
    }

    public async Task InitializeAsync()
    {
        var token = await _client.RegisterAndLoginAsync();
        _client.UseBearer(token);
    }

    public async Task DisposeAsync()
    {
        _client.Dispose();
        await _factory.DisposeAsync();
    }

    private static object Payload(string company, DateTime dateApplied) => new
    {
        CompanyName = company,
        Position = "Engineer",
        ApplicationLink = "https://example.com/jobs/" + company.ToLowerInvariant(),
        Status = "Applied",
        Description = "Applied via the company website.",
        DateApplied = dateApplied.ToString("o")
    };

    [Fact]
    public async Task List_ReturnsAppsOrderedByDateAppliedDescending()
    {
        // Insert out of date order to prove the index/sort is actually doing the work.
        var middle = DateTime.UtcNow.AddDays(-5);
        var oldest = DateTime.UtcNow.AddDays(-30);
        var newest = DateTime.UtcNow.AddDays(-1);

        await _client.PostAsJsonAsync("/api/JobApplication", Payload("MiddleCo", middle));
        await _client.PostAsJsonAsync("/api/JobApplication", Payload("OldestCo", oldest));
        await _client.PostAsJsonAsync("/api/JobApplication", Payload("NewestCo", newest));

        var response = await _client.GetAsync("/api/JobApplication");
        var body = await response.ReadJsonAsync();
        var arr = body.GetProperty("jobApplications");

        Assert.Equal(3, arr.GetArrayLength());
        Assert.Equal("NewestCo", arr[0].GetProperty("companyName").GetString());
        Assert.Equal("MiddleCo", arr[1].GetProperty("companyName").GetString());
        Assert.Equal("OldestCo", arr[2].GetProperty("companyName").GetString());
    }

    [Fact]
    public async Task JobApplications_CompoundIndexIsCreated()
    {
        // Trigger app startup so EnsureIndexesAsync() has run.
        _ = await _client.GetAsync("/api/JobApplication");

        var mongoClient = new MongoClient(_fixture.ConnectionString);
        var db = mongoClient.GetDatabase(_factory.DatabaseName);
        var indexes = await db.GetCollection<JobApplication>("JobApplications")
            .Indexes.List()
            .ToListAsync();

        var expected = indexes
            .FirstOrDefault(i => i["name"].AsString == "ix_jobapps_user_dateapplied_desc");

        Assert.NotNull(expected);

        var keys = expected!["key"].AsBsonDocument;
        Assert.Equal(1, keys["UserId"].AsInt32);          // ascending
        Assert.Equal(-1, keys["DateApplied"].AsInt32);    // descending
    }

    [Fact]
    public async Task Users_EmailIndexIsUniqueAndCaseInsensitive()
    {
        _ = await _client.GetAsync("/api/JobApplication");

        var mongoClient = new MongoClient(_fixture.ConnectionString);
        var db = mongoClient.GetDatabase(_factory.DatabaseName);
        var indexes = await db.GetCollection<Models.User>("Users").Indexes.List().ToListAsync();

        var emailIndex = indexes.FirstOrDefault(i => i["name"].AsString == "ux_users_email");
        Assert.NotNull(emailIndex);
        Assert.True(emailIndex!["unique"].AsBoolean);

        // Collation: case-insensitive (strength 2 = secondary)
        var collation = emailIndex["collation"].AsBsonDocument;
        Assert.Equal("en", collation["locale"].AsString);
        Assert.Equal(2, collation["strength"].AsInt32);
    }
}
