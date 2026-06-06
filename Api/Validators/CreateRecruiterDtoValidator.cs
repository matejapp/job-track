using Api.Dto;
using FluentValidation;

namespace Api.Validators
{
    public class CreateRecruiterDtoValidator : AbstractValidator<CreateRecruiterDto>
    {
        public CreateRecruiterDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().MinimumLength(2).WithMessage("Name is required");

            RuleFor(x => x.Title)
                .NotEmpty().MinimumLength(2).WithMessage("Title is required");

            RuleFor(x => x.Company)
                .NotEmpty().MinimumLength(2).WithMessage("Company is required");

            RuleFor(x => x.LinkedInProfile)
                .NotEmpty().WithMessage("LinkedIn profile is required")
                .Must(IsValidUri).WithMessage("LinkedIn profile must be a valid URL");

            RuleFor(x => x.Email)
                .EmailAddress().WithMessage("Email is not valid")
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
