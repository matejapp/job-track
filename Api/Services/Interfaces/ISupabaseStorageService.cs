namespace Api.Services.Interfaces
{
    public interface ISupabaseStorageService
    {
        Task<string> UploadAsync(
            string userId, string documentId, byte[] fileBytes,
            string contentType, string extension);

        Task<string> GetSignedUrlAsync(string storagePath, int expiresInSeconds = 3600);

        Task DeleteAsync(string storagePath);
    }
}
