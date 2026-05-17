namespace Api.Common
{
    public record Error(string Code, string Message);

    public record Result<T>(bool isSuccess, T? Value, Error? Error)
    {
        public static Result<T> Success(T value) => new(true, value, null);
        public static Result<T> Failure(Error error) => new(false, default, error);
        public static Result<T> Failure(string code, string message) => new(false, default, new Error(code, message));

    }
}