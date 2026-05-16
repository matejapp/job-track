using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Api.Dto;
using Api.Models;
using Api.Shared;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableRateLimiting("FixedWindow")]

    public class AuthController : ControllerBase
    {
        private readonly MongoDBContext _database;
        private readonly IConfiguration _configuration;

        public AuthController(MongoDBContext context, IConfiguration configuration)
        {
            _database = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            var userExist = await _database.Users.Find(u => u.Email == registerDto.Email).FirstOrDefaultAsync();
            if (userExist != null)
            {
                return BadRequest("User already exists");
            }

            var user = new User
            {
                Name = registerDto.Name,
                Email = registerDto.Email,
                PasswordHashed = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                DateCreated = DateTime.UtcNow.ToString("o") // ISO 8601 format
            };

            await _database.Users.InsertOneAsync(user);

            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _database.Users.Find(u => u.Email == loginDto.Email).FirstOrDefaultAsync();
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHashed))
            {
                return Unauthorized("Invalid email or password");
            }

            user.LastLogin = DateTime.UtcNow.ToString("o");
            await _database.Users.ReplaceOneAsync(u => u.Id == user.Id, user);
            var token = GenerateJwtToken(user);

            return Ok(token);
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
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
