using Api.Dto;


namespace Api.Services.Interfaces
{
    public interface IJobApplicationService
    {
        Task<ResponseJobApplicationDto?> GetByIdAsync(string id, string userId);
        Task CreateAsync(CreateJobApplicationDto dto, string userId);
        Task<bool> DeleteAsync(string userId, string id);
        Task<IEnumerable<ResponseJobApplicationDto>> GetByUserIdAsync(string userId);
    }
}