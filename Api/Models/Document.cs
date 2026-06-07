using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Api.Models.Types;

namespace Api.Models
{
    public class Document
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = null!;
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = null!;
        public string Name { get; set; } = null!;
        public DocumentFileType FileType { get; set; } = DocumentFileType.Pdf;
        public DocumentType Type { get; set; } = DocumentType.Resume;
        public string StoragePath { get; set; } = null!;
        public string FileUrl { get; set; } = null!;
        public string? Version { get; set; }
        public List<string> UsedInApplicationIds { get; set; } = [];
        [BsonElement("uploaded_at")]
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}