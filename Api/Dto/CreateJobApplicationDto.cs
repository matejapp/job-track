using Api.Models;

namespace Api.Dto
{
    public class CreateJobApplicationDto
    {

        public string CompanyName { get; set; } = 1;
        public string Position { get; set; } = String.Empty;
        public string ApplicationLink { get; set; } = String.Empty;
        public ApplicationStatus Status { get; set; } = ApplicationStatus.Applied;
        public string Description { get; set; } = String.Empty;
        public DateTime DateApplied { get; set; }

    }
}