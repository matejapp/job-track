using Api.Dto;
using Api.Services.Interfaces;
using Api.Shared;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableRateLimiting("SlidingWindow")]
    [Authorize]
    public class ActivityController : ControllerBase
    {
        private readonly IActivityService _service;
        private readonly IValidator<CreateActivityDto> _validator;

        public ActivityController(IActivityService service, IValidator<CreateActivityDto> validator)
        {
            _service = service;
            _validator = validator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var activities = await _service.GetActivitiesAsync(userId);
            return Ok(new { activities });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var activity = await _service.GetActivityByIdAsync(userId, id);
            return Ok(new { activity });
        }

        [HttpGet("job/{jobId}")]
        public async Task<IActionResult> GetByJobId(string jobId)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var activities = await _service.GetActivitiesByJobIdAsync(userId, jobId);
            return Ok(new { activities });
        }

        [HttpPost("job/{jobId}")]
        public async Task<IActionResult> Create(string jobId, [FromBody] CreateActivityDto dto)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var validation = await _validator.ValidateAsync(dto);
            if (!validation.IsValid)
                return BadRequest(new { errors = validation.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage }) });

            var activity = await _service.CreateActivityAsync(userId, jobId, dto);
            return CreatedAtAction(nameof(GetById), new { id = activity.Id }, new { activity });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] CreateActivityDto dto)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var validation = await _validator.ValidateAsync(dto);
            if (!validation.IsValid)
                return BadRequest(new { errors = validation.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage }) });

            var activity = await _service.UpdateActivityAsync(userId, id, dto);
            return Ok(new { activity });
        }

        [HttpPatch("{id}/complete")]
        public async Task<IActionResult> ToggleComplete(string id)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            await _service.ToggleCompleteAsync(userId, id);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            await _service.DeleteActivityAsync(userId, id);
            return NoContent();
        }
    }
}
