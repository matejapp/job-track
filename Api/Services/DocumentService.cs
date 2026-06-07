using Api.Common;
using Api.Dto;
using Api.Models;
using Api.Models.Types;
using Api.Repositories.Interfaces;
using Api.Services.Interfaces;
using MongoDB.Bson;

namespace Api.Services
{
    public class DocumentService : IDocumentService
    {
        private readonly IDocumentRepository _repo;
        private readonly ISupabaseStorageService _storage;

        public DocumentService(IDocumentRepository repo, ISupabaseStorageService storage)
        {
            _repo = repo;
            _storage = storage;
        }

        public async Task<IEnumerable<ResponseDocumentDto>> GetDocumentsAsync(string userId)
        {
            var entities = await _repo.GetByUserIdAsync(userId);
            var dtos = new List<ResponseDocumentDto>();
            foreach (var entity in entities)
            {
                var signedUrl = await _storage.GetSignedUrlAsync(entity.StoragePath);
                var dto = ToDto(entity);
                dto.FileUrl = signedUrl;
                dtos.Add(dto);
            }
            return dtos;
        }

        public async Task<ResponseDocumentDto> UploadDocumentAsync(string userId, IFormFile file, CreateDocumentDto dto)
        {
            var extension = Path.GetExtension(file.FileName).TrimStart('.').ToLowerInvariant();
            var documentId = ObjectId.GenerateNewId().ToString();

            using var ms = new MemoryStream();
            await file.CopyToAsync(ms);
            var bytes = ms.ToArray();

            var storagePath = await _storage.UploadAsync(
                userId, documentId, bytes, file.ContentType, extension);

            var signedUrl = await _storage.GetSignedUrlAsync(storagePath);

            var entity = new Document
            {
                Id = documentId,
                UserId = userId,
                Name = dto.Name,
                Type = ParseDocumentType(dto.Type),
                FileType = extension == "pdf" ? DocumentFileType.Pdf : DocumentFileType.Docx,
                StoragePath = storagePath,
                FileUrl = signedUrl,
                Version = dto.Version,
                UsedInApplicationIds = [],
                UploadedAt = DateTime.UtcNow,
            };

            await _repo.AddAsync(entity);
            return ToDto(entity);
        }

        public async Task DeleteDocumentAsync(string userId, string id)
        {
            var entity = await _repo.GetByIdAsync(id);
            if (entity == null || entity.UserId != userId)
                throw new BusinessException(ErrorCodes.NotFound, "Document not found", StatusCodes.Status404NotFound);

            await _storage.DeleteAsync(entity.StoragePath);
            await _repo.DeleteAsync(id);
        }

        private static DocumentType ParseDocumentType(string type) => type.ToLowerInvariant() switch
        {
            "cover_letter" => DocumentType.CoverLetter,
            "portfolio" => DocumentType.Portfolio,
            _ => DocumentType.Resume,
        };

        private static string MapDocumentType(DocumentType type) => type switch
        {
            DocumentType.CoverLetter => "cover_letter",
            DocumentType.Portfolio => "portfolio",
            DocumentType.Other => "other",
            _ => "resume",
        };

        private static string MapFileType(DocumentFileType type) => type switch
        {
            DocumentFileType.Docx => "docx",
            _ => "pdf",
        };

        private static ResponseDocumentDto ToDto(Document d) => new()
        {
            Id = d.Id,
            Name = d.Name,
            Type = MapDocumentType(d.Type),
            FileType = MapFileType(d.FileType),
            FileUrl = d.FileUrl,
            Version = d.Version,
            UsedInApplicationIds = d.UsedInApplicationIds,
            UploadedAt = d.UploadedAt,
        };
    }
}
