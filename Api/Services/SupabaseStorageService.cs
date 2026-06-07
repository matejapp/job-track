using Api.Services.Interfaces;

namespace Api.Services
{
    public class SupabaseStorageService : ISupabaseStorageService
    {
        private readonly Supabase.Client _supabase;
        private const string BucketName = "documents";

        public SupabaseStorageService(Supabase.Client supabase)
        {
            _supabase = supabase;
        }

        public async Task<string> UploadAsync(
            string userId, string documentId, byte[] fileBytes,
            string contentType, string extension)
        {
            var storagePath = $"{userId}/{documentId}.{extension}";

            await _supabase.Storage
                .From(BucketName)
                .Upload(fileBytes, storagePath, new Supabase.Storage.FileOptions { ContentType = contentType });

            return storagePath;
        }

        public async Task<string> GetSignedUrlAsync(string storagePath, int expiresInSeconds = 3600)
        {
            return await _supabase.Storage.From(BucketName).CreateSignedUrl(storagePath, expiresIn: expiresInSeconds);
        }

        public async Task DeleteAsync(string storagePath)
        {
            await _supabase.Storage
                .From(BucketName)
                .Remove(new List<string> { storagePath });
        }
    }
}
