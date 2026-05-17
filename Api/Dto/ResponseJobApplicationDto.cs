using Api.Models;

namespace Api.Dto
{
    public class ResponseJobApplicationDto
    {
        public string Id { get; set; } = String.Empty;
        public string UserId { get; set; } = String.Empty;
        public string CompanyName { get; set; } = String.Empty;
        public string Position { get; set; } = String.Empty;
        public string ApplicationLink { get; set; } = String.Empty;
        public ApplicationStatus Status { get; set; } = ApplicationStatus.Applied;
        public string Description { get; set; } = String.Empty;
        public DateTime DateApplied { get; set; }
        public DateTime DateUpdated { get; set; }
        public DateTime DateCreated { get; set; }
    }
}