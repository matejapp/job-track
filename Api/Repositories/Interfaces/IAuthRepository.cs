using Api.Models;

namespace Api.Repositories.Interfaces
{
    public interface IAuthRepository
    {
        Task<User?> CreateUser(User user);
        Task<User?> GetUserByEmail(string email);
        Task UpdateLastLoginAsync(string id, DateTime timestamp);
    }

}