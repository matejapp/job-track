using Api.Models;

namespace Api.Repositories.Interfaces
{
    public interface IRecruiterRepository
    {
        Task<IEnumerable<Recruiter>> GetAllAsync(string userId);
        Task<Recruiter?> GetByIdAsync(string id);
        Task AddAsync(Recruiter entity);
        Task<bool> UpdateAsync(Recruiter entity);
        Task<bool> DeleteAsync(string id);
    }
}
