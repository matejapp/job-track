using Api.Models;

namespace Api.Repositories.Interfaces
{
    public interface IJobApplicationRepository
    {
        Task<IEnumerable<JobApplication>> GetByUserIdAsync(string userId);
        Task<JobApplication?> GetByIdAsync(string id);
        Task AddAsync(JobApplication entity);
        Task<bool> DeleteAsync(string id);
        Task<bool> UpdateAsync(JobApplication entity);
    }
}