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
            .Must(isValidName).WithMessage("Name is not valid");

            RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Email is not valid");

            RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters");

        }

        private static bool isValidName(string? name) => !string.IsNullOrWhiteSpace(name) && name.Length >= 2 && name.All(char.IsLetter);
    }
}


