using Api.Models;
using Api.Repositories.Interfaces;
using Api.Shared;
using MongoDB.Driver;

namespace Api.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly IMongoCollection<User> _collection;

        public AuthRepository(MongoDBContext context) => _collection = context.Users;

        public async Task<User?> CreateUser(User user)
        {
            await _collection.InsertOneAsync(user);
            return user;
        }
        public async Task<User?> GetUserByEmail(string email)

        {
            return await _collection.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        public async Task UpdateLastLoginAsync(string id, DateTime timestamp)
        {
            await _collection.UpdateOneAsync(
                u => u.Id == id,
                Builders<User>.Update.Set(u => u.LastLogin, timestamp)
            );
        }

    }
}