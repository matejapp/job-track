using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Api.Models
{
    public class JobApplication
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = string.Empty;

        public string CompanyName { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string ApplicationLink { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Salary { get; set; } = string.Empty;
        public string Source { get; set; } = string.Empty;
        public string ResumeVersion { get; set; } = string.Empty;

        [BsonRepresentation(BsonType.String)]
        public WorkMode WorkMode { get; set; } = WorkMode.OnSite;


        [BsonRepresentation(BsonType.ObjectId)]
        public string? RecruiterId { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string? DocumentId { get; set; }

        [BsonRepresentation(BsonType.String)]
        public ApplicationStatus Status { get; set; } = ApplicationStatus.Applied;

        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime DateApplied { get; set; }

        [BsonElement("updated_at")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime DateUpdated { get; set; }

        [BsonElement("created_at")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime DateCreated { get; set; }
    }
}
