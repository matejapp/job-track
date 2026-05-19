using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace Api.Tests.Helpers;

public static class AuthHelper
{
    public static async Task<string> RegisterAndLoginAsync(
        this HttpClient client,
        string name = "Test",
        string email = null!,
        string password = "Passw0rd!")
    {
        email ??= $"u{Guid.NewGuid():N}@example.com";

        var registerResponse = await client.PostAsJsonAsync("/api/Auth/register",
            new { Name = name, Email = email, Password = password });
        registerResponse.EnsureSuccessStatusCode();

        var loginResponse = await client.PostAsJsonAsync("/api/Auth/login",
            new { Email = email, Password = password });
        loginResponse.EnsureSuccessStatusCode();

        var doc = await loginResponse.ReadJsonAsync();
        return doc.GetProperty("token").GetString()!;
    }

    public static void UseBearer(this HttpClient client, string token)
    {
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }
}
