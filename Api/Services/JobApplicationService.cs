
using Api.Common;
using Api.Dto;
using Api.Models;
using Api.Repositories.Interfaces;
using Api.Services.Interfaces;

namespace Api.Services
{
    public class JobApplicationService : IJobApplicationService
    {
        private readonly IJobApplicationRepository _repo;

        public JobApplicationService(IJobApplicationRepository repo)
        {
            _repo = repo;
        }

        public async Task<ResponseJobApplicationDto> GetByIdAsync(string userId, string id)
        {
            var entity = await _repo.GetByIdAsync(id);

            if (entity == null || entity.UserId != userId)
                throw new BusinessException(ErrorCodes.NotFound, "Job application not found", StatusCodes.Status404NotFound);

            return ToDto(entity);
        }

        public async Task<ResponseJobApplicationDto> CreateAsync(string userId, CreateJobApplicationDto dto)
        {
            var entity = new JobApplication
            {
                UserId = userId,
                CompanyName = dto.CompanyName,
                Position = dto.Position,
                ApplicationLink = dto.ApplicationLink,
                Status = dto.Status,
                DateApplied = dto.DateApplied.ToUniversalTime(),
                DateCreated = DateTime.UtcNow,
                DateUpdated = DateTime.UtcNow,
            };

            await _repo.AddAsync(entity);

            return ToDto(entity);
        }

        public async Task DeleteAsync(string userId, string id)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null || existing.UserId != userId)
                throw new BusinessException(ErrorCodes.NotFound, "Job application not found", StatusCodes.Status404NotFound);

            await _repo.DeleteAsync(id);
        }

        public async Task<IEnumerable<ResponseJobApplicationDto>> GetByUserIdAsync(string userId)
        {
            var entities = await _repo.GetByUserIdAsync(userId);
            return entities.Select(ToDto).ToList();
        }

        public async Task UpdateAsync(string userId, string id, CreateJobApplicationDto dto)
        {
            var existing = await _repo.GetByIdAsync(id);

            if (existing == null || existing.UserId != userId)
                throw new BusinessException(ErrorCodes.NotFound, "Job application not found", StatusCodes.Status404NotFound);

            existing.CompanyName = dto.CompanyName;
            existing.Position = dto.Position;
            existing.ApplicationLink = dto.ApplicationLink;
            existing.Status = dto.Status;
            existing.DateApplied = dto.DateApplied.ToUniversalTime();
            existing.DateUpdated = DateTime.UtcNow;

            await _repo.UpdateAsync(existing);
        }

        private static ResponseJobApplicationDto ToDto(JobApplication entity) => new()
        {
            Id = entity.Id ?? string.Empty,
            UserId = entity.UserId,
            CompanyName = entity.CompanyName,
            Position = entity.Position,
            ApplicationLink = entity.ApplicationLink,
            Status = entity.Status,
            DateApplied = entity.DateApplied,
            DateUpdated = entity.DateUpdated,
            DateCreated = entity.DateCreated
        };
    }
}