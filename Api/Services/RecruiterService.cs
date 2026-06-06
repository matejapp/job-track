using Api.Common;
using Api.Dto;
using Api.Models;
using Api.Repositories.Interfaces;
using Api.Services.Interfaces;

namespace Api.Services
{
    public class RecruiterService : IRecruiterService
    {
        private readonly IRecruiterRepository _repo;

        public RecruiterService(IRecruiterRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<ResponseRecruiterDto>> GetAllAsync(string userId)
        {
            var entities = await _repo.GetAllAsync(userId);
            return entities.Select(ToDto).ToList();
        }

        public async Task<ResponseRecruiterDto> GetByIdAsync(string userId, string id)
        {
            var entity = await _repo.GetByIdAsync(id);
            if (entity == null || entity.UserId != userId)
                throw new BusinessException(ErrorCodes.NotFound, "Recruiter not found", StatusCodes.Status404NotFound);

            return ToDto(entity);
        }

        public async Task<ResponseRecruiterDto> CreateAsync(string userId, CreateRecruiterDto dto)
        {
            var entity = new Recruiter
            {
                UserId = userId,
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                Title = dto.Title,
                Company = dto.Company,
                LinkedInProfile = dto.LinkedInProfile,
                Notes = dto.Notes,
                LastContactedAt = dto.LastContactedAt?.ToUniversalTime(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _repo.AddAsync(entity);
            return ToDto(entity);
        }

        public async Task<ResponseRecruiterDto> UpdateAsync(string userId, string id, CreateRecruiterDto dto)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null || existing.UserId != userId)
                throw new BusinessException(ErrorCodes.NotFound, "Recruiter not found", StatusCodes.Status404NotFound);

            existing.Name = dto.Name;
            existing.Email = dto.Email;
            existing.Phone = dto.Phone;
            existing.Title = dto.Title;
            existing.Company = dto.Company;
            existing.LinkedInProfile = dto.LinkedInProfile;
            existing.Notes = dto.Notes;
            existing.LastContactedAt = dto.LastContactedAt?.ToUniversalTime();
            existing.UpdatedAt = DateTime.UtcNow;

            await _repo.UpdateAsync(existing);
            return ToDto(existing);
        }

        public async Task DeleteAsync(string userId, string id)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null || existing.UserId != userId)
                throw new BusinessException(ErrorCodes.NotFound, "Recruiter not found", StatusCodes.Status404NotFound);

            await _repo.DeleteAsync(id);
        }

        private static ResponseRecruiterDto ToDto(Recruiter r) => new()
        {
            Id = r.Id ?? string.Empty,
            Name = r.Name,
            Email = r.Email,
            Phone = r.Phone,
            Title = r.Title,
            Company = r.Company,
            LinkedInProfile = r.LinkedInProfile,
            Notes = r.Notes,
            LastContactedAt = r.LastContactedAt,
            UpdatedAt = r.UpdatedAt,
            CreatedAt = r.CreatedAt
        };
    }
}
