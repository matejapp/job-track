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
    public class JobApplicationController : ControllerBase
    {
        private readonly IJobApplicationService _service;
        private readonly IValidator<CreateJobApplicationDto> _validator;

        public JobApplicationController(IJobApplicationService service, IValidator<CreateJobApplicationDto> validator)
        {
            _service = service;
            _validator = validator;
        }


        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var jobApplications = await _service.GetByUserIdAsync(userId);
            return Ok(new { jobApplications });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var jobApplication = await _service.GetByIdAsync(userId, id);
            return jobApplication is null
                ? NotFound(new { error = "Job application not found" })
                : Ok(new { jobApplication });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateJobApplicationDto dto)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var validation = await _validator.ValidateAsync(dto);
            if (!validation.IsValid)
            {
                return BadRequest(new
                {
                    errors = validation.Errors.Select(e => e.PropertyName + ": " + e.ErrorMessage)
                });
            }

            var jobApplication = await _service.CreateAsync(userId, dto);
            return CreatedAtAction(
                nameof(GetById),
                new { id = jobApplication.Id },
                new { jobApplication });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] CreateJobApplicationDto dto)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var validation = await _validator.ValidateAsync(dto);
            if (!validation.IsValid)
            {
                return BadRequest(new
                {
                    errors = validation.Errors.Select(e => e.PropertyName + ": " + e.ErrorMessage)
                });
            }

            var updated = await _service.UpdateAsync(userId, id, dto);
            return updated
                ? NoContent()
                : NotFound(new { error = "Job application not found" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var deleted = await _service.DeleteAsync(userId, id);
            return deleted
                ? NoContent()
                : NotFound(new { error = "Job application not found" });
        }
    }
}
