using Api.Dto;
using Api.Services.Interfaces;
using Api.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/documents")]
    [Authorize]
    [EnableRateLimiting("SlidingWindow")]
    public class DocumentController : ControllerBase
    {
        private readonly IDocumentService _service;

        public DocumentController(IDocumentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = User.GetUserId();
            var docs = await _service.GetDocumentsAsync(userId);
            return Ok(new { data = docs });
        }

        [HttpPost]
        [RequestSizeLimit(10 * 1024 * 1024)]
        public async Task<IActionResult> Upload([FromForm] CreateDocumentDto dto, IFormFile file)
        {
            if (file is null || file.Length == 0)
                return BadRequest(new { error = new { message = "No file provided" } });

            var ext = Path.GetExtension(file.FileName).TrimStart('.').ToLowerInvariant();
            if (ext != "pdf" && ext != "docx")
                return BadRequest(new { error = new { message = "Only PDF and DOCX files are allowed" } });

            var userId = User.GetUserId();
            var result = await _service.UploadDocumentAsync(userId, file, dto);
            return Ok(new { data = result });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var userId = User.GetUserId();
            await _service.DeleteDocumentAsync(userId, id);
            return NoContent();
        }
    }
}
