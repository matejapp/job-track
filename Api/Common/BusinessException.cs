namespace Api.Common
{
    public class BusinessException : Exception
    {
        public string Code { get; }
        public int StatusCode { get; }
        public BusinessException(string code, string message, int statusCode = StatusCodes.Status400BadRequest) : base(message)
        {
            Code = code;
            StatusCode = statusCode;
        }
    }
}