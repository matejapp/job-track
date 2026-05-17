using Api.Common;
using Api.Dto;


namespace Api.Services.Interfaces
{
    public interface IAuthService
    {
        Task<Result<GetUserDto>> RegisterUser(RegisterDto registerDto);
        Task<string?> LoginUser(LoginDto loginDto);
    }
}
