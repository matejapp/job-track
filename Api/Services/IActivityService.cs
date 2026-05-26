using Api.Common;
using Api.Dto;
using Api.Models;
using Api.Repositories.Interfaces;
using Api.Services.Interfaces;

namespace Api.Services
{
    public class ActivityService : IActivityService
    {
        private readonly IActivityRepository _repo;

        public ActivityService(IActivityRepository repo)
        {
            _repo = repo;
        }

        public async Task<ResponseActivityDto> CreateActivityAsync(string userId, string jobId, CreateActivityDto dto)
        {
            var activity = new Activity
            {
                UserId = userId,
                JobId = jobId,
                Name = dto.Name,
                Description = dto.Description,
                Date = dto.Date.ToUniversalTime(),
                Importance = dto.Importance,
                DateCreated = DateTime.UtcNow,
                DateUpdated = DateTime.UtcNow,
                Completed = false
            };

            await _repo.AddAsync(activity);
            return ToDto(activity);
        }

        public async Task<IEnumerable<ResponseActivityDto>> GetActivitiesAsync(string userId)
        {
            var activities = await _repo.GetByUserIdAsync(userId);
            return activities.Select(ToDto).ToList();
        }

        public async Task<ResponseActivityDto> GetActivityByIdAsync(string userId, string id)
        {
            var activity = await _repo.GetByIdAsync(id);
            if (activity == null || activity.UserId != userId)
                throw new BusinessException(ErrorCodes.NotFound, "Activity not found", StatusCodes.Status404NotFound);

            return ToDto(activity);
        }

        public async Task<IEnumerable<ResponseActivityDto>> GetActivitiesByJobIdAsync(string userId, string jobId)
        {
            var activities = await _repo.GetByJobIdAsync(jobId);
            return activities.Where(a => a.UserId == userId).Select(ToDto).ToList();
        }

        public async Task<ResponseActivityDto> UpdateActivityAsync(string userId, string id, CreateActivityDto dto)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null || existing.UserId != userId)
                throw new BusinessException(ErrorCodes.NotFound, "Activity not found", StatusCodes.Status404NotFound);

            existing.Name = dto.Name;
            existing.Description = dto.Description;
            existing.Date = dto.Date.ToUniversalTime();
            existing.Importance = dto.Importance;
            existing.DateUpdated = DateTime.UtcNow;

            await _repo.UpdateAsync(existing);
            return ToDto(existing);
        }

        public async Task ToggleCompleteAsync(string userId, string id)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null || existing.UserId != userId)
                throw new BusinessException(ErrorCodes.NotFound, "Activity not found", StatusCodes.Status404NotFound);

            existing.Completed = !existing.Completed;
            existing.DateUpdated = DateTime.UtcNow;

            await _repo.UpdateAsync(existing);
        }

        public async Task DeleteActivityAsync(string userId, string id)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null || existing.UserId != userId)
                throw new BusinessException(ErrorCodes.NotFound, "Activity not found", StatusCodes.Status404NotFound);

            await _repo.DeleteAsync(id);
        }

        private static ResponseActivityDto ToDto(Activity a) => new()
        {
            Id = a.Id ?? string.Empty,
            UserId = a.UserId,
            JobId = a.JobId,
            Name = a.Name,
            Description = a.Description,
            Importance = a.Importance,
            Date = a.Date,
            DateCreated = a.DateCreated,
            DateUpdated = a.DateUpdated,
            Completed = a.Completed,
            TimeLeft = a.Date - DateTime.UtcNow,
            IsUpcoming = !a.Completed && a.Date > DateTime.UtcNow && a.Date <= DateTime.UtcNow.AddDays(7)
        };
    }
}
