using Api.Models;
using Api.Repositories.Interfaces;
using Api.Shared;
using MongoDB.Driver;

namespace Api.Repositories
{
    public class ActivityRepository : IActivityRepository
    {
        private readonly IMongoCollection<Activity> _collection;

        public ActivityRepository(MongoDBContext db)
        {
            _collection = db.Activities;
        }

        public async Task<Activity?> GetByIdAsync(string id) =>
            await _collection.Find(a => a.Id == id).FirstOrDefaultAsync();

        public async Task<IEnumerable<Activity>> GetByUserIdAsync(string userId) =>
            await _collection
                .Find(a => a.UserId == userId)
                .SortByDescending(a => a.Date)
                .ToListAsync();

        public async Task<IEnumerable<Activity>> GetByJobIdAsync(string jobId) =>
            await _collection
                .Find(a => a.JobId == jobId)
                .SortByDescending(a => a.Date)
                .ToListAsync();

        public async Task AddAsync(Activity activity) =>
            await _collection.InsertOneAsync(activity);

        public async Task<bool> UpdateAsync(Activity activity)
        {
            var result = await _collection.ReplaceOneAsync(a => a.Id == activity.Id, activity);
            return result.MatchedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _collection.DeleteOneAsync(a => a.Id == id);
            return result.DeletedCount > 0;
        }
    }
}
