using Api.Dto;

namespace Api.Services.Interfaces
{
    public interface IActivityService
    {
        Task<ResponseActivityDto> CreateActivityAsync(string userId, string jobId, CreateActivityDto dto);
        Task<IEnumerable<ResponseActivityDto>> GetActivitiesAsync(string userId);
        Task<ResponseActivityDto> GetActivityByIdAsync(string userId, string id);
        Task<IEnumerable<ResponseActivityDto>> GetActivitiesByJobIdAsync(string userId, string jobId);
        Task<ResponseActivityDto> UpdateActivityAsync(string userId, string id, CreateActivityDto dto);
        Task ToggleCompleteAsync(string userId, string id);
        Task DeleteActivityAsync(string userId, string id);
    }
}
