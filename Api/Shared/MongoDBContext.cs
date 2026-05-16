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


    }
}