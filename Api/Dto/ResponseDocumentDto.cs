namespace Api.Dto
{
    public class ResponseDocumentDto
    {
        public string Id { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Type { get; set; } = null!;
        public string FileType { get; set; } = null!;
        public string FileUrl { get; set; } = null!;
        public string? Version { get; set; }
        public List<string> UsedInApplicationIds { get; set; } = [];
        public DateTime UploadedAt { get; set; }
    }
}
