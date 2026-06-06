using Api.Models;
using Api.Repositories.Interfaces;
using Api.Shared;
using MongoDB.Driver;

namespace Api.Repositories
{
    public class RecruiterRepository : IRecruiterRepository
    {
        private readonly IMongoCollection<Recruiter> _collection;

        public RecruiterRepository(MongoDBContext db)
        {
            _collection = db.Recruiters;
        }

        public async Task<IEnumerable<Recruiter>> GetAllAsync(string userId)
            => await _collection
                .Find(r => r.UserId == userId)
                .SortByDescending(r => r.CreatedAt)
                .ToListAsync();

        public async Task<Recruiter?> GetByIdAsync(string id)
            => await _collection.Find(r => r.Id == id).FirstOrDefaultAsync();

        public async Task AddAsync(Recruiter entity)
            => await _collection.InsertOneAsync(entity);

        public async Task<bool> UpdateAsync(Recruiter entity)
        {
            var result = await _collection.ReplaceOneAsync(r => r.Id == entity.Id, entity);
            return result.MatchedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _collection.DeleteOneAsync(r => r.Id == id);
            return result.DeletedCount > 0;
        }
    }
}
