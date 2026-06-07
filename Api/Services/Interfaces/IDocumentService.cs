using Api.Dto;

namespace Api.Services.Interfaces
{
    public interface IDocumentService
    {
        Task<IEnumerable<ResponseDocumentDto>> GetDocumentsAsync(string userId);
        Task<ResponseDocumentDto> UploadDocumentAsync(string userId, IFormFile file, CreateDocumentDto dto);
        Task DeleteDocumentAsync(string userId, string id);
    }
}
