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
    [Route("api/jobapplications/{jobId}/notes")]
    [EnableRateLimiting("SlidingWindow")]
    [Authorize]
    public class NoteController : ControllerBase
    {
        private readonly INoteService _service;
        private readonly IValidator<CreateNoteDto> _validator;

        public NoteController(INoteService service, IValidator<CreateNoteDto> validator)
        {
            _service = service;
            _validator = validator;
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

            var validation = await _validator.ValidateAsync(dto);
            if (!validation.IsValid)
                return BadRequest(new { errors = validation.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage }) });

            var note = await _service.CreateAsync(userId, jobId, dto);
            return CreatedAtAction(nameof(GetAll), new { jobId }, new { note });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string jobId, string id, [FromBody] CreateNoteDto dto)
        {
            var userId = User.GetUserId();
            if (userId == null) return Unauthorized();

            var validation = await _validator.ValidateAsync(dto);
            if (!validation.IsValid)
                return BadRequest(new { errors = validation.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage }) });

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
