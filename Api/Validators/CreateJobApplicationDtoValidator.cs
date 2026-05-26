using Api.Dto;
using FluentValidation;

namespace Api.Validators
{
    public class CreateJobApplicationDtoValidator : AbstractValidator<CreateJobApplicationDto>
    {
        public CreateJobApplicationDtoValidator()
        {
            RuleFor(x => x.CompanyName).NotEmpty().MinimumLength(2).WithMessage("Company name is required");
            RuleFor(x => x.Position).NotEmpty().MinimumLength(2).WithMessage("Position is required");
            RuleFor(x => x.ApplicationLink).Must(isValidUri).WithMessage("Application link is not valid");
            RuleFor(x => x.DateApplied).Must(isValidDate).WithMessage("Date applied is not valid");
        }

        private static bool isValidUri(string? url) => Uri.TryCreate(url, UriKind.Absolute, out var uriResult) && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
        private static bool isValidDate(DateTime date) => date <= DateTime.UtcNow;

    }
}