using Api.Models;
using MongoDB.Driver;

namespace Api.Shared
{
    public class MongoDBContext
    {
        private readonly IMongoDatabase _database;

        public IMongoCollection<User> Users;
        public IMongoCollection<JobApplication> JobApplications;

        public MongoDBContext(IConfiguration configuration)
        {
            var client = new MongoClient(configuration["MongoDB:ConnectionString"]);
            _database = client.GetDatabase(configuration["MongoDB:DatabaseName"]);

            Users = _database.GetCollection<User>(configuration.GetValue<string>("MongoDB:UsersCollection"));
            JobApplications = _database.GetCollection<JobApplication>(configuration.GetValue<string>("MongoDB:JobApplicationsCollection"));
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
        }


    }
}