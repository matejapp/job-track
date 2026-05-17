using Api.Common;
using Api.Dto;
using Api.Services.Interfaces;
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
            if (!result.isSuccess)
            {
                return result.Error!.Code switch
                {
                    ErrorCodes.EmailAlreadyInUse => Conflict(new
                    {
                        error = result.Error.Message
                    }),
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
