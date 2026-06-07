namespace Api.Dto
{
    public class CreateDocumentDto
    {
        public string Name { get; set; } = null!;
        public string Type { get; set; } = null!;
        public string? Version { get; set; }
    }
}
