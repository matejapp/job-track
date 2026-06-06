using Api.Dto;

namespace Api.Services.Interfaces
{
    public interface IRecruiterService
    {
        Task<IEnumerable<ResponseRecruiterDto>> GetAllAsync(string userId);
        Task<ResponseRecruiterDto> GetByIdAsync(string userId, string id);
        Task<ResponseRecruiterDto> CreateAsync(string userId, CreateRecruiterDto dto);
        Task<ResponseRecruiterDto> UpdateAsync(string userId, string id, CreateRecruiterDto dto);
        Task DeleteAsync(string userId, string id);
    }
}
