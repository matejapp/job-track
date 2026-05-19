using System.Net.Http.Json;
using System.Text.Json;

namespace Api.Tests.Helpers;

public static class HttpJson
{
    public static readonly JsonSerializerOptions Options = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public static Task<HttpResponseMessage> PostJsonAsync(this HttpClient client, string url, object body)
        => client.PostAsJsonAsync(url, body);

    public static Task<HttpResponseMessage> PutJsonAsync(this HttpClient client, string url, object body)
        => client.PutAsJsonAsync(url, body);

    public static async Task<JsonElement> ReadJsonAsync(this HttpResponseMessage response)
    {
        var body = await response.Content.ReadAsStringAsync();
        return JsonDocument.Parse(body).RootElement;
    }
}
