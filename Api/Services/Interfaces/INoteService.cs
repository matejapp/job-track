using Api.Dto;

namespace Api.Services.Interfaces
{
    public interface INoteService
    {
        Task<ResponseNoteDto> CreateAsync(string userId, string jobId, CreateNoteDto dto);
        Task<IEnumerable<ResponseNoteDto>> GetByJobIdAsync(string userId, string jobId);
        Task<ResponseNoteDto> UpdateAsync(string userId, string id, CreateNoteDto dto);
        Task DeleteAsync(string userId, string id);
    }
}
