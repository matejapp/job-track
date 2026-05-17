namespace Api.Common
{
    public record ApiResponse<T>(T? Data, Error? Error, string? TraceId)
    {
        public static ApiResponse<T> Ok(T data, string traceId) => new(data, null, traceId);
        public static ApiResponse<T> Fail(Error error, string traceId) => new(default, error, traceId);
    }
}