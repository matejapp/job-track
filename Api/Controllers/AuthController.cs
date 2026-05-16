using Api.Dto;
using Api.Services.Interfaces;
using Api.Shared;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;


namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableRateLimiting("FixedWindow")]

    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;

        public AuthController(IAuthService service)
        {
            _service = service;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var result = await _service.RegisterUser(dto);
            if (!result.Success)
            {
                return result.Error switch
                {
                    AuthError.EmailAlreadyInUse => Conflict(new { error = "Email already in use" }),
                    _ => StatusCode(500, new { error = "Something went wrong" })
                };
            }
            return Ok(new { user = result.Value });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var token = await _service.LoginUser(dto);
            if (token == null)
                return Unauthorized(new { error = "Invalid email or password" });

            return Ok(new { token });
        }
    }

}
