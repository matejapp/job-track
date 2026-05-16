namespace Api.Dto
{
    public class CreateJobApplicationDto
    {

        public string CompanyName { get; set; } = String.Empty;
        public string Position { get; set; } = String.Empty;
        public string ApplicationLink { get; set; } = String.Empty;
        public string Status { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public DateTime DateApplied { get; set; }

    }
}