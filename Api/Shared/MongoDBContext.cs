using Api.Models;
using MongoDB.Driver;

namespace Api.Shared
{
    public class MongoDBContext
    {
        private readonly IMongoDatabase _database;

        public IMongoCollection<User> Users;
        public IMongoCollection<JobApplication> JobApplications;
        public IMongoCollection<Activity> Activities;
        public IMongoCollection<Note> Notes;

        public MongoDBContext(IConfiguration configuration)
        {
            var client = new MongoClient(configuration["MongoDB:ConnectionString"]);
            _database = client.GetDatabase(configuration["MongoDB:DatabaseName"]);

            Users = _database.GetCollection<User>(configuration.GetValue<string>("MongoDB:UsersCollection"));
            JobApplications = _database.GetCollection<JobApplication>(configuration.GetValue<string>("MongoDB:JobApplicationsCollection"));
            Activities = _database.GetCollection<Activity>(configuration.GetValue<string>("MongoDB:ActivityCollection"));
            Notes = _database.GetCollection<Note>(configuration.GetValue<string>("MongoDB:NotesCollection"));
        }

        public async Task MigrateAsync()
        {
            // JobApplications: Description replaced by the Notes collection
            await JobApplications.UpdateManyAsync(
                Builders<JobApplication>.Filter.Exists("Description"),
                Builders<JobApplication>.Update.Unset("Description"));

            // Activities: time_left and isUpcoming are now computed on read, not stored
            var activityUpdate = Builders<Activity>.Update
                .Unset("time_left")
                .Unset("isUpcoming");

            await Activities.UpdateManyAsync(
                Builders<Activity>.Filter.Or(
                    Builders<Activity>.Filter.Exists("time_left"),
                    Builders<Activity>.Filter.Exists("isUpcoming")),
                activityUpdate);
        }

        public async Task EnsureIndexesAsync()
        {
            var emailIndex = new CreateIndexModel<User>(
                Builders<User>.IndexKeys.Ascending(u => u.Email),
                new CreateIndexOptions
                {
                    Unique = true,
                    Name = "ux_users_email",
                    Collation = new Collation("en", strength: CollationStrength.Secondary)
                });

            await Users.Indexes.CreateOneAsync(emailIndex);

            var jobIndex = new CreateIndexModel<JobApplication>(
                Builders<JobApplication>.IndexKeys
                    .Ascending(ja => ja.UserId)
                    .Descending(ja => ja.DateApplied),
                new CreateIndexOptions { Name = "ix_jobapps_user_dateapplied_desc" });

            await JobApplications.Indexes.CreateOneAsync(jobIndex);

            var activityIndex = new CreateIndexModel<Activity>(
                Builders<Activity>.IndexKeys
                    .Ascending(a => a.UserId)
                    .Ascending(a => a.JobId),
                new CreateIndexOptions { Name = "ix_activities_user_job" });

            await Activities.Indexes.CreateOneAsync(activityIndex);

            var noteIndex = new CreateIndexModel<Note>(
                Builders<Note>.IndexKeys
                    .Ascending(n => n.UserId)
                    .Ascending(n => n.JobId),
                new CreateIndexOptions { Name = "ix_notes_user_job" });

            await Notes.Indexes.CreateOneAsync(noteIndex);
        }
    }
}
