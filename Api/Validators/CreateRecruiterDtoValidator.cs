using Api.Dto;
using FluentValidation;

namespace Api.Validators
{
    public class CreateRecruiterDtoValidator : AbstractValidator<CreateRecruiterDto>
    {
        public CreateRecruiterDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required")
                .MinimumLength(2).WithMessage("Name must be at least 2 characters")
                .MaximumLength(200).WithMessage("Name must not exceed 200 characters");

            RuleFor(x => x.Title)
                .MaximumLength(200).WithMessage("Title must not exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.Title));

            RuleFor(x => x.Company)
                .NotEmpty().WithMessage("Company is required")
                .MinimumLength(2).WithMessage("Company must be at least 2 characters")
                .MaximumLength(200).WithMessage("Company must not exceed 200 characters");

            RuleFor(x => x.LinkedInProfile)
                .Must(IsValidUri).WithMessage("LinkedIn profile must be a valid URL")
                .MaximumLength(500).WithMessage("LinkedIn profile URL must not exceed 500 characters")
                .When(x => !string.IsNullOrEmpty(x.LinkedInProfile));

            RuleFor(x => x.Email)
                .EmailAddress().WithMessage("Email is not valid")
                .MaximumLength(254).WithMessage("Email must not exceed 254 characters")
                .When(x => !string.IsNullOrEmpty(x.Email));

            RuleFor(x => x.Phone)
                .MaximumLength(20).WithMessage("Phone number is too long")
                .When(x => !string.IsNullOrEmpty(x.Phone));

            RuleFor(x => x.Notes)
                .MaximumLength(2000).WithMessage("Notes cannot exceed 2000 characters")
                .When(x => !string.IsNullOrEmpty(x.Notes));

            RuleFor(x => x.LastContactedAt)
                .Must(d => d!.Value <= DateTime.UtcNow).WithMessage("Last contacted date cannot be in the future")
                .When(x => x.LastContactedAt.HasValue);
        }

        private static bool IsValidUri(string? url) =>
            Uri.TryCreate(url, UriKind.Absolute, out var uri) &&
            (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
    }
}
