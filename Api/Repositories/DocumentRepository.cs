using Api.Models;
using Api.Repositories.Interfaces;
using Api.Shared;
using MongoDB.Driver;

namespace Api.Repositories
{
    public class DocumentRepository : IDocumentRepository
    {
        private readonly IMongoCollection<Document> _collection;

        public DocumentRepository(MongoDBContext db)
        {
            _collection = db.Documents;
        }

        public async Task<IEnumerable<Document>> GetByUserIdAsync(string userId)
            => await _collection
                .Find(d => d.UserId == userId)
                .SortByDescending(d => d.UploadedAt)
                .ToListAsync();

        public async Task<Document?> GetByIdAsync(string id)
            => await _collection.Find(d => d.Id == id).FirstOrDefaultAsync();

        public async Task AddAsync(Document entity)
            => await _collection.InsertOneAsync(entity);

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _collection.DeleteOneAsync(d => d.Id == id);
            return result.DeletedCount > 0;
        }

        public async Task UpdateUsedInApplicationsAsync(string documentId, string applicationId, bool add)
        {
            var update = add
                ? Builders<Document>.Update.AddToSet(d => d.UsedInApplicationIds, applicationId)
                : Builders<Document>.Update.Pull(d => d.UsedInApplicationIds, applicationId);
            await _collection.UpdateOneAsync(d => d.Id == documentId, update);
        }
    }
}
