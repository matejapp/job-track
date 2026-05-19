namespace Api.Tests.Fixtures;

[CollectionDefinition("Mongo")]
public class MongoCollectionDefinition : ICollectionFixture<MongoFixture>
{
    // Marker only. xUnit uses the [CollectionDefinition] attribute to share
    // the MongoFixture (one Mongo container) across every test class that
    // declares [Collection("Mongo")]. Each test class still gets its own
    // database name via TestWebAppFactory, so tests stay isolated.
}
