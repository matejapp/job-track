using Api.Dto;
using Api.Shared;

namespace Api.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResult<GetUserDto>> RegisterUser(RegisterDto registerDto);
        Task<string?> LoginUser(LoginDto loginDto);
    }
}
