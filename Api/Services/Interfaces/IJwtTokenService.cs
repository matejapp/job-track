using Api.Models;

namespace Api.Services.Interfaces
{
    public interface IJwtTokenService
    {
        string GenerateJwtToken(User user);
    }
}