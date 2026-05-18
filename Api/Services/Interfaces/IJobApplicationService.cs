using Api.Dto;


namespace Api.Services.Interfaces
{
    public interface IJobApplicationService
    {
        Task<ResponseJobApplicationDto> GetByIdAsync(string userId, string id);
        Task<ResponseJobApplicationDto> CreateAsync(string userId, CreateJobApplicationDto dto);
        Task DeleteAsync(string userId, string id);
        Task<IEnumerable<ResponseJobApplicationDto>> GetByUserIdAsync(string userId);
        Task UpdateAsync(string userId, string id, CreateJobApplicationDto dto);
    }
}