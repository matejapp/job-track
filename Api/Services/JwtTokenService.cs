using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Api.Models;
using Api.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;


namespace Api.Services
{
    public class JwtTokenService : IJwtTokenService
    {
        private readonly IConfiguration _configuration;
        public JwtTokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        public string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration["JWT:SecretKey"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var claim = new[]
            {

                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id!)
            };
            var token = new JwtSecurityToken(
                claims: claim,
                expires: DateTime.UtcNow.AddHours(3),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}