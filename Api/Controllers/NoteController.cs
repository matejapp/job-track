using Api.Dto;
using Api.Services.Interfaces;
using Api.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/jobapplications/{jobId}/notes")]
    [EnableRateLimiting("SlidingWindow")]
    [Authorize]
    public class NoteController : ControllerBase
    {
        private readonly INoteService _service;

        public NoteController(INoteService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(string jobId)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var notes = await _service.GetByJobIdAsync(userId, jobId);
            return Ok(new { notes });
        }

        [HttpPost]
        public async Task<IActionResult> Create(string jobId, [FromBody] CreateNoteDto dto)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            if (string.IsNullOrWhiteSpace(dto.Content))
                return BadRequest(new { error = "Content is required." });

            var note = await _service.CreateAsync(userId, jobId, dto);
            return CreatedAtAction(nameof(GetAll), new { jobId }, new { note });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string jobId, string id, [FromBody] CreateNoteDto dto)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            if (string.IsNullOrWhiteSpace(dto.Content))
                return BadRequest(new { error = "Content is required." });

            var note = await _service.UpdateAsync(userId, id, dto);
            return Ok(new { note });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string jobId, string id)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            await _service.DeleteAsync(userId, id);
            return NoContent();
        }
    }
}
