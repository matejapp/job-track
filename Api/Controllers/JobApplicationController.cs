using System.Security.Claims;
using Api.Dto;
using Api.Services.Interfaces;
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


        public JobApplicationController(IJobApplicationService service)
        {
            _service = service;
        }


        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            var userId = userIdClaim.Value;

            var result = await _service.GetByUserIdAsync(userId);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateJobApplicationDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            var userId = userIdClaim.Value;
            var created = await _service.CreateAsync(userId, dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            var userId = userIdClaim.Value;
            var result = await _service.DeleteAsync(userId, id);
            return result ? NoContent() : NotFound();

        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            var userId = userIdClaim.Value;
            var result = await _service.GetByIdAsync(userId, id);
            return result is null ? NotFound() : Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] CreateJobApplicationDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            var userId = userIdClaim.Value;

            var result = await _service.UpdateAsync(userId, id, dto);
            return result ? NoContent() : NotFound();

        }

    }

}


