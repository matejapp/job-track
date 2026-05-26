using Api.Models;
using Api.Repositories.Interfaces;
using Api.Shared;
using MongoDB.Driver;

namespace Api.Repositories
{
    public class NoteRepository : INoteRepository
    {
        private readonly IMongoCollection<Note> _collection;

        public NoteRepository(MongoDBContext db)
        {
            _collection = db.Notes;
        }

        public async Task<Note?> GetByIdAsync(string id) =>
            await _collection.Find(n => n.Id == id).FirstOrDefaultAsync();

        public async Task<IEnumerable<Note>> GetByJobIdAsync(string jobId) =>
            await _collection
                .Find(n => n.JobId == jobId)
                .SortByDescending(n => n.DateCreated)
                .ToListAsync();

        public async Task AddAsync(Note note) =>
            await _collection.InsertOneAsync(note);

        public async Task<bool> UpdateAsync(Note note)
        {
            var result = await _collection.ReplaceOneAsync(n => n.Id == note.Id, note);
            return result.MatchedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _collection.DeleteOneAsync(n => n.Id == id);
            return result.DeletedCount > 0;
        }

        public async Task DeleteByJobIdAsync(string jobId) =>
            await _collection.DeleteManyAsync(n => n.JobId == jobId);
    }
}
