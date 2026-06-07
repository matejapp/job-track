using Api.Dto;
using FluentValidation;

namespace Api.Validators
{
    public class CreateJobApplicationDtoValidator : AbstractValidator<CreateJobApplicationDto>
    {
        public CreateJobApplicationDtoValidator()
        {
            RuleFor(x => x.CompanyName)
                .NotEmpty().WithMessage("Company name is required")
                .MinimumLength(2).WithMessage("Company name must be at least 2 characters")
                .MaximumLength(200).WithMessage("Company name must not exceed 200 characters");

            RuleFor(x => x.Position)
                .NotEmpty().WithMessage("Position is required")
                .MinimumLength(2).WithMessage("Position must be at least 2 characters")
                .MaximumLength(200).WithMessage("Position must not exceed 200 characters");

            RuleFor(x => x.ApplicationLink)
                .Must(isValidUri).WithMessage("Application link is not valid")
                .MaximumLength(2000).WithMessage("Application link must not exceed 2000 characters")
                .When(x => !string.IsNullOrEmpty(x.ApplicationLink));

            RuleFor(x => x.DateApplied)
                .Must(isValidDate).WithMessage("Date applied is not valid");

            RuleFor(x => x.Location)
                .MinimumLength(2).WithMessage("Location must be at least 2 characters")
                .MaximumLength(200).WithMessage("Location must not exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.Location));

            RuleFor(x => x.Salary)
                .MinimumLength(2).WithMessage("Salary must be at least 2 characters")
                .MaximumLength(100).WithMessage("Salary must not exceed 100 characters")
                .When(x => !string.IsNullOrEmpty(x.Salary));

            RuleFor(x => x.Source)
                .MinimumLength(2).WithMessage("Source must be at least 2 characters")
                .MaximumLength(200).WithMessage("Source must not exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.Source));

            RuleFor(x => x.ResumeVersion)
                .MinimumLength(2).WithMessage("Resume version must be at least 2 characters")
                .MaximumLength(100).WithMessage("Resume version must not exceed 100 characters")
                .When(x => !string.IsNullOrEmpty(x.ResumeVersion));
        }

        private static bool isValidUri(string? url) =>
            Uri.TryCreate(url, UriKind.Absolute, out var uriResult) &&
            (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);

        private static bool isValidDate(DateTime date) => date <= DateTime.UtcNow;
    }
}