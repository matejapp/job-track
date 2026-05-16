using Api.Models;
using Api.Repositories.Interfaces;
using Api.Shared;
using MongoDB.Driver;

namespace Api.Repositories
{
    public class JobApplicationRepository : IJobApplicationRepository
    {
        private readonly IMongoCollection<JobApplication> _collection;

        public JobApplicationRepository(MongoDBContext db)
        {
            _collection = db.JobApplications;
        }

        public async Task<IEnumerable<JobApplication>> GetByUserIdAsync(string userId)
        => await _collection.Find(j => j.UserId == userId).ToListAsync();

        public async Task<JobApplication?> GetByIdAsync(string id) => await _collection.Find(ja => ja.Id == id).FirstOrDefaultAsync();

        public async Task AddAsync(JobApplication ja) => await _collection.InsertOneAsync(ja);

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _collection.DeleteOneAsync(ja => ja.Id == id);
            return result.DeletedCount > 0;
        }

        public async Task<bool> UpdateAsync(JobApplication entity)
        {
            var result = await _collection.ReplaceOneAsync(ja => ja.Id == entity.Id, entity);
            return result.MatchedCount > 0;
        }
    }
}