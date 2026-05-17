using Api.Common;
using Api.Dto;
using Api.Models;
using Api.Repositories.Interfaces;
using Api.Services.Interfaces;


namespace Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _repo;
        private readonly IJwtTokenService _jwt;

        public AuthService(IAuthRepository repo, IJwtTokenService jwt)
        {
            _repo = repo;
            _jwt = jwt;
        }

        public async Task<Result<GetUserDto>> RegisterUser(RegisterDto registerDto)
        {
            var existing = await _repo.GetUserByEmail(registerDto.Email);
            if (existing != null)
                return Result<GetUserDto>.Failure(ErrorCodes.EmailAlreadyInUse, "Email already in use");

            var user = new User
            {
                Name = registerDto.Name,
                Email = registerDto.Email,
                PasswordHashed = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                DateCreated = DateTime.UtcNow
            };

            var created = await _repo.CreateUser(user);

            return Result<GetUserDto>.Success(new GetUserDto
            {
                Id = created!.Id,
                Name = created.Name,
                Email = created.Email
            });
        }

        public async Task<string?> LoginUser(LoginDto loginDto)
        {
            var user = await _repo.GetUserByEmail(loginDto.Email);
            if (user == null) return null;
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHashed)) return null;

            var now = DateTime.UtcNow;
            user.LastLogin = now;
            await _repo.UpdateLastLoginAsync(user.Id!, now);



            return _jwt.GenerateJwtToken(user);
        }
    }
}
