using Api.Models;

namespace Api.Repositories.Interfaces
{
    public interface IDocumentRepository
    {
        Task<IEnumerable<Document>> GetByUserIdAsync(string userId);
        Task<Document?> GetByIdAsync(string id);
        Task AddAsync(Document entity);
        Task<bool> DeleteAsync(string id);
        Task UpdateUsedInApplicationsAsync(string documentId, string applicationId, bool add);
    }
}
