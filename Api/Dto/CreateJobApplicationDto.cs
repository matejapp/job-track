using Api.Models;

namespace Api.Dto
{
    public class CreateJobApplicationDto
    {
        public string? RecruiterId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string ApplicationLink { get; set; } = string.Empty;
        public ApplicationStatus Status { get; set; } = ApplicationStatus.Applied;
        public string Location { get; set; } = string.Empty;
        public string Salary { get; set; } = string.Empty;
        public string Source { get; set; } = string.Empty;
        public string ResumeVersion { get; set; } = string.Empty;
        public WorkMode WorkMode { get; set; } = WorkMode.OnSite;
        public DateTime DateApplied { get; set; }
    }
}
