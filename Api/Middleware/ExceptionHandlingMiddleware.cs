using System.Diagnostics;
using Api.Common;
using Microsoft.AspNetCore.Diagnostics;

namespace Api.Middleware
{
    public class ExceptionHandlingMiddleware : IExceptionHandler
    {
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(ILogger<ExceptionHandlingMiddleware> logger)
        {
            _logger = logger;
        }

        public async ValueTask<bool> TryHandleAsync(HttpContext ctx, Exception ex, CancellationToken ct)
        {
            if (ex is OperationCanceledException && ct.IsCancellationRequested)
            {
                return true;
            }

            var traceId = Activity.Current?.Id ?? ctx.TraceIdentifier;

            var (status, error) = ex switch
            {
                BusinessException be => (be.StatusCode, new Error(be.Code, be.Message)),
                _ => (StatusCodes.Status500InternalServerError, new Error(ErrorCodes.InternalServerError, "Something went wrong"))

            };

            if (status >= 500)
            {
                _logger.LogError(ex, "Unhandled exception on {traceId}", traceId);
            }
            else
            {
                _logger.LogWarning(ex, "Business error {Code} on {traceId}", error.Code, traceId);
            }

            ctx.Response.StatusCode = status;
            ctx.Response.ContentType = "application/json";

            await ctx.Response.WriteAsJsonAsync(ApiResponse<object>.Fail(error, traceId), ct);
            return true;
        }
    }


}
