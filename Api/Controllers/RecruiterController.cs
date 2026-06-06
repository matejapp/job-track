using Api.Dto;
using Api.Services.Interfaces;
using Api.Shared;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Caching.Memory;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableRateLimiting("SlidingWindow")]
    [Authorize]
    public class RecruiterController : ControllerBase
    {
        private readonly IRecruiterService _service;
        private readonly IValidator<CreateRecruiterDto> _validator;
        private readonly IMemoryCache _cache;
        private readonly string _cacheKey = "recruiters";

        public RecruiterController(IRecruiterService service, IValidator<CreateRecruiterDto> validator, IMemoryCache cache)
        {
            _service = service;
            _validator = validator;
            _cache = cache;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var recruiters = _cache.GetOrCreateAsync(_cacheKey + userId, async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);
                entry.SlidingExpiration = TimeSpan.FromMinutes(2);
                return await _service.GetAllAsync(userId);
            });
            return Ok(new { recruiters });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var recruiter = await _service.GetByIdAsync(userId, id);
            _cache.Remove(_cacheKey + userId); // Invalidate cache on read to ensure consistency
            return Ok(new { recruiter });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateRecruiterDto dto)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var validation = await _validator.ValidateAsync(dto);
            if (!validation.IsValid)
                return BadRequest(new { errors = validation.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage }) });

            var recruiter = await _service.CreateAsync(userId, dto);
            _cache.Remove(_cacheKey + userId); // Invalidate cache on create to ensure consistency
            return CreatedAtAction(nameof(GetById), new { id = recruiter.Id }, new { recruiter });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] CreateRecruiterDto dto)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var validation = await _validator.ValidateAsync(dto);
            if (!validation.IsValid)
                return BadRequest(new { errors = validation.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage }) });

            var recruiter = await _service.UpdateAsync(userId, id, dto);
            _cache.Remove(_cacheKey + userId); // Invalidate cache on update to ensure consistency
            return Ok(new { recruiter });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            await _service.DeleteAsync(userId, id);
            _cache.Remove(_cacheKey + userId); // Invalidate cache on delete to ensure consistency
            return NoContent();
        }
    }
}
