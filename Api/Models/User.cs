using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using System.Text.Json.Serialization;

namespace Api.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id {get; set;}
        public string Name {get; set;} = String.Empty;
        public string Email {get; set;} =  String.Empty;
        public string PasswordHashed {get; set;} = String.Empty;
        [BsonElement("created_at")]
        public string DateCreated { get; set; } = String.Empty;  
        [BsonElement("last_login")]
        public string LastLogin { get; set; } = String.Empty;
    }
}