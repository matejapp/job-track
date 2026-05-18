using Api.Common;
using Api.Dto;
using Api.Services.Interfaces;
using FluentValidation;
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
        private readonly IValidator<RegisterDto> _registerValidator;
        private readonly IValidator<LoginDto> _loginValidator;

        public AuthController(IAuthService service, IValidator<RegisterDto> registerValidator, IValidator<LoginDto> loginValidator)
        {
            _service = service;
            _registerValidator = registerValidator;
            _loginValidator = loginValidator;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var validation = await _registerValidator.ValidateAsync(dto);
            if (!validation.IsValid)
            {
                return BadRequest(new
                {
                    errors = validation.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage })
                });
            }

            var user = await _service.RegisterUser(dto);
            return Ok(new { user });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var validation = await _loginValidator.ValidateAsync(dto);
            if (!validation.IsValid)
                throw new BusinessException(ErrorCodes.InvalidCredentials, "Invalid email or password", StatusCodes.Status401Unauthorized);

            var token = await _service.LoginUser(dto);
            return Ok(new { token });
        }
    }

}
