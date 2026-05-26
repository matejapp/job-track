using Api.Models;

namespace Api.Dto
{
    public class CreateActivityDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ActivityImportance Importance { get; set; } = ActivityImportance.Low;
        public DateTime Date { get; set; }
    }
}
