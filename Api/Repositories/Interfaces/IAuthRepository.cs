using Api.Models;

namespace Api.Repositories.Interfaces
{
    public interface IAuthRepository
    {
        Task<User?> CreateUser(User user);
        Task<User?> GetUserByEmail(string email);
        Task UpdateLastLoginAsync(string id, DateTime timestamp);
        Task<User?> GetUserByResetTokenAsync(string token);
        Task UpdatePasswordResetTokenAsync(string id, string? token, DateTime? expiry);
        Task UpdatePasswordAsync(string id, string hashedPassword);
    }

}