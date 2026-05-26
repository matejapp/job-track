using Api.Common;
using Api.Dto;
using Api.Models;
using Api.Repositories.Interfaces;
using Api.Services.Interfaces;

namespace Api.Services
{
    public class NoteService : INoteService
    {
        private readonly INoteRepository _repo;
        private readonly IJobApplicationRepository _jobRepo;

        public NoteService(INoteRepository repo, IJobApplicationRepository jobRepo)
        {
            _repo = repo;
            _jobRepo = jobRepo;
        }

        public async Task<ResponseNoteDto> CreateAsync(string userId, string jobId, CreateNoteDto dto)
        {
            var job = await _jobRepo.GetByIdAsync(jobId);
            if (job == null || job.UserId != userId)
                throw new BusinessException(ErrorCodes.NotFound, "Job application not found", StatusCodes.Status404NotFound);

            var note = new Note
            {
                UserId = userId,
                JobId = jobId,
                Content = dto.Content,
                DateCreated = DateTime.UtcNow,
                DateUpdated = DateTime.UtcNow
            };

            await _repo.AddAsync(note);
            return ToDto(note);
        }

        public async Task<IEnumerable<ResponseNoteDto>> GetByJobIdAsync(string userId, string jobId)
        {
            var job = await _jobRepo.GetByIdAsync(jobId);
            if (job == null || job.UserId != userId)
                throw new BusinessException(ErrorCodes.NotFound, "Job application not found", StatusCodes.Status404NotFound);

            var notes = await _repo.GetByJobIdAsync(jobId);
            return notes.Select(ToDto).ToList();
        }

        public async Task<ResponseNoteDto> UpdateAsync(string userId, string id, CreateNoteDto dto)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null || existing.UserId != userId)
                throw new BusinessException(ErrorCodes.NotFound, "Note not found", StatusCodes.Status404NotFound);

            existing.Content = dto.Content;
            existing.DateUpdated = DateTime.UtcNow;

            await _repo.UpdateAsync(existing);
            return ToDto(existing);
        }

        public async Task DeleteAsync(string userId, string id)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null || existing.UserId != userId)
                throw new BusinessException(ErrorCodes.NotFound, "Note not found", StatusCodes.Status404NotFound);

            await _repo.DeleteAsync(id);
        }

        private static ResponseNoteDto ToDto(Note n) => new()
        {
            Id = n.Id ?? string.Empty,
            UserId = n.UserId,
            JobId = n.JobId,
            Content = n.Content,
            DateCreated = n.DateCreated,
            DateUpdated = n.DateUpdated
        };
    }
}
