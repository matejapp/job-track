using Api.Models;

namespace Api.Dto
{
    public class CreateJobApplicationDto
    {
        public string CompanyName { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string ApplicationLink { get; set; } = string.Empty;
        public ApplicationStatus Status { get; set; } = ApplicationStatus.Applied;
        public DateTime DateApplied { get; set; }
    }
}
