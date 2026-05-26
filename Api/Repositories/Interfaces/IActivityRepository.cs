using Api.Models;

namespace Api.Repositories.Interfaces
{
    public interface IActivityRepository
    {
        Task<Activity?> GetByIdAsync(string id);
        Task<IEnumerable<Activity>> GetByUserIdAsync(string userId);
        Task<IEnumerable<Activity>> GetByJobIdAsync(string jobId);
        Task AddAsync(Activity activity);
        Task<bool> UpdateAsync(Activity activity);
        Task<bool> DeleteAsync(string id);
    }
}
