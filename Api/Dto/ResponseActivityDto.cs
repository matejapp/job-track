using Api.Models;

namespace Api.Dto
{
    public class ResponseActivityDto
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string JobId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ActivityImportance Importance { get; set; }
        public DateTime Date { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public TimeSpan TimeLeft { get; set; }
        public bool Completed { get; set; }
        public bool IsUpcoming { get; set; }
    }
}
