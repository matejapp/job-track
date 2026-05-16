namespace Api.Shared
{
    public enum AuthError
    {
        None,
        EmailAlreadyInUse,
    }

    public record AuthResult<T>(T? Value, AuthError Error)
    {
        public bool Success => Error == AuthError.None;

        public static AuthResult<T> Ok(T value) => new(value, AuthError.None);
        public static AuthResult<T> Fail(AuthError error) => new(default, error);
    }
}
