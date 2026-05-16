using System.Security.Claims;
using Api.Dto;
using Api.Models;
using Api.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class JobApplicationController : ControllerBase
    {

        private readonly MongoDBContext _database;

        public JobApplicationController(MongoDBContext context)
        {
            _database = context;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetJobApplications()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim not found");
            }

            var userId = userIdClaim.Value;

            var jobApplications = await _database.JobApplications.Find(ja => ja.UserId == userId).ToListAsync();

            var responseJobApplications = jobApplications.Select(ja => new ResponseJobApplicationDto
            {
                Id = ja.Id!,
                UserId = ja.UserId,
                CompanyName = ja.CompanyName,
                Position = ja.Position,
                ApplicationLink = ja.ApplicationLink,
                Status = ja.Status,
                Description = ja.Description,
                DateApplied = ja.DateApplied,
                DateUpdated = ja.DateUpdated,
                DateCreated = ja.DateCreated
            });
            return Ok(responseJobApplications);
        }

        [HttpPost("")]
        public async Task<IActionResult> CreateJobApplication([FromBody] CreateJobApplicationDto CJaDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim not found");
            }

            var userId = userIdClaim.Value;

            var jobApplication = new JobApplication
            {
                UserId = userId,
                CompanyName = CJaDto.CompanyName,
                Position = CJaDto.Position,
                ApplicationLink = CJaDto.ApplicationLink,
                Status = CJaDto.Status,
                Description = CJaDto.Description,
                DateApplied = CJaDto.DateApplied,
                DateCreated = DateTime.UtcNow.ToString("o")
            };

            await _database.JobApplications.InsertOneAsync(jobApplication);
            return Ok(jobApplication);

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJobApplication(string id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("Unauthorized");
            }

            var userId = userIdClaim.Value;

            var jobApplicationToDelete = await _database.JobApplications.Find(ja => ja.Id == id && ja.UserId == userId).FirstOrDefaultAsync();
            if (jobApplicationToDelete == null)
            {
                return NotFound("Job application not found");
            }

            await _database.JobApplications.DeleteOneAsync(ja => ja.Id == jobApplicationToDelete.Id);
            return Ok(new { message = "JobApplication deleted succesfully" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJobApplication(string id, [FromBody] CreateJobApplicationDto jaDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("Unauthorized");
            }

            var userId = userIdClaim.Value;

            var jobApplicationToUpdate = await _database.JobApplications.Find(ja => ja.Id == id && ja.UserId == userId).FirstOrDefaultAsync();
            if (jobApplicationToUpdate == null)
            {
                return NotFound("Job application not found");
            }

            jobApplicationToUpdate.CompanyName = jaDto.CompanyName;
            jobApplicationToUpdate.Position = jaDto.Position;
            jobApplicationToUpdate.ApplicationLink = jaDto.ApplicationLink;
            jobApplicationToUpdate.Status = jaDto.Status;
            jobApplicationToUpdate.Description = jaDto.Description;
            jobApplicationToUpdate.DateApplied = jaDto.DateApplied;
            jobApplicationToUpdate.DateUpdated = DateTime.UtcNow.ToString("o");

            await _database.JobApplications.ReplaceOneAsync(ja => ja.Id == jobApplicationToUpdate.Id, jobApplicationToUpdate);

            return Ok(jobApplicationToUpdate);
        }


    };



}


