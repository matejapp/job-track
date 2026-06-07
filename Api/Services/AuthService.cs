using System.Security.Cryptography;
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
        private readonly ILogger<AuthService> _logger;
        private readonly IEmailService _email;
        private readonly IConfiguration _config;

        public AuthService(IAuthRepository repo, IJwtTokenService jwt, ILogger<AuthService> logger, IEmailService email, IConfiguration config)
        {
            _repo = repo;
            _jwt = jwt;
            _logger = logger;
            _email = email;
            _config = config;
        }

        public async Task<GetUserDto> RegisterUser(RegisterDto registerDto)
        {
            var existing = await _repo.GetUserByEmail(registerDto.Email);
            if (existing != null)
            {
                _logger.LogWarning("Registration attempt with already-used email {Email}", registerDto.Email);
                throw new BusinessException(ErrorCodes.EmailAlreadyInUse, "Email already in use", StatusCodes.Status409Conflict);
            }

            var user = new User
            {
                Name = registerDto.Name,
                Email = registerDto.Email,
                PasswordHashed = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                DateCreated = DateTime.UtcNow
            };

            var created = await _repo.CreateUser(user);
            _logger.LogInformation("User registered {UserId}", created!.Id);

            return new GetUserDto
            {
                Id = created.Id,
                Name = created.Name,
                Email = created.Email
            };
        }

        public async Task<string> LoginUser(LoginDto loginDto)
        {
            var user = await _repo.GetUserByEmail(loginDto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHashed))
            {
                _logger.LogWarning("Failed login attempt for email {Email}", loginDto.Email);
                throw new BusinessException(ErrorCodes.InvalidCredentials, "Invalid email or password", StatusCodes.Status401Unauthorized);
            }

            var now = DateTime.UtcNow;
            user.LastLogin = now;
            await _repo.UpdateLastLoginAsync(user.Id!, now);

            _logger.LogInformation("User logged in {UserId}", user.Id);
            return _jwt.GenerateJwtToken(user);
        }

        public async Task<GetUserDto> GetUserName(string email)
        {
            var user = await _repo.GetUserByEmail(email);
            if (user == null)
                throw new BusinessException(ErrorCodes.NotFound, "User not found", StatusCodes.Status404NotFound);

            return new GetUserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email
            };
        }

        public async Task RequestPasswordResetAsync(string email)
        {
            var user = await _repo.GetUserByEmail(email);
            if (user == null)
                return; // Don't reveal whether the email exists

            var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
            var expiry = DateTime.UtcNow.AddHours(1);

            await _repo.UpdatePasswordResetTokenAsync(user.Id!, token, expiry);

            var baseUrl = _config["AppBaseUrl"] ?? "https://job-track.app";
            var resetLink = $"{baseUrl}/reset-password?token={token}";

            await _email.SendPasswordResetEmailAsync(email, resetLink);
            _logger.LogInformation("Password reset email sent for user {UserId}", user.Id);
        }

        public async Task ResetPasswordAsync(string token, string newPassword)
        {
            var user = await _repo.GetUserByResetTokenAsync(token);
            if (user == null)
                throw new BusinessException(ErrorCodes.InvalidCredentials, "Invalid or expired token", StatusCodes.Status400BadRequest);

            if (user.PasswordResetTokenExpiry < DateTime.UtcNow)
                throw new BusinessException(ErrorCodes.InvalidCredentials, "Invalid or expired token", StatusCodes.Status400BadRequest);

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await _repo.UpdatePasswordAsync(user.Id!, hashedPassword);
            await _repo.UpdatePasswordResetTokenAsync(user.Id!, null, null);

            _logger.LogInformation("Password reset successfully for user {UserId}", user.Id);
        }
    }
}
