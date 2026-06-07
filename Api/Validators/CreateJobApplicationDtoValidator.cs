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
            RuleFor(x => x.Location).NotEmpty().MinimumLength(2).WithMessage("Location is required");
            RuleFor(x => x.Salary).MinimumLength(2).WithMessage("Salary must be at least 2 characters long");
            RuleFor(x => x.Source).MinimumLength(2).WithMessage("Source must be at least 2 characters long");
            RuleFor(x => x.ResumeVersion).MinimumLength(2).WithMessage("Resume version must be at least 2 characters long");

        }


        private static bool isValidUri(string? url) => Uri.TryCreate(url, UriKind.Absolute, out var uriResult) && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
        private static bool isValidDate(DateTime date) => date <= DateTime.UtcNow;

    }
}