namespace Api.Dto
{
    public class CreateRecruiterDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public string LinkedInProfile { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public DateTime? LastContactedAt { get; set; }
    }
}
