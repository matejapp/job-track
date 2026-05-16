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
        public string UserId { get; set; } = String.Empty;
        public string CompanyName { get; set; } = String.Empty;
        public string Position { get; set; } = String.Empty;
        public string ApplicationLink { get; set; } = String.Empty;
        public string Status { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;

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

