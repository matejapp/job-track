using Api.Dto;
using FluentValidation;

namespace Api.Validators
{
    public class RegisterDtoValidator : AbstractValidator<RegisterDto>
    {
        public RegisterDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required")
                .MaximumLength(200).WithMessage("Name must not exceed 200 characters")
                .Must(isValidName).WithMessage("Name is not valid");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Email is not valid")
                .MaximumLength(254).WithMessage("Email must not exceed 254 characters");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters")
                .MaximumLength(100).WithMessage("Password must not exceed 100 characters");
        }

        private static bool isValidName(string? name) => !string.IsNullOrWhiteSpace(name) && name.Length >= 2 && name.All(char.IsLetter);
    }
}


