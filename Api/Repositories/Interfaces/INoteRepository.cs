using Api.Models;

namespace Api.Repositories.Interfaces
{
    public interface INoteRepository
    {
        Task<Note?> GetByIdAsync(string id);
        Task<IEnumerable<Note>> GetByJobIdAsync(string jobId);
        Task AddAsync(Note note);
        Task<bool> UpdateAsync(Note note);
        Task<bool> DeleteAsync(string id);
        Task DeleteByJobIdAsync(string jobId);
    }
}
