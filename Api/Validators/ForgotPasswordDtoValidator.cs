using Api.Dto;
using FluentValidation;

namespace Api.Validators
{
    public class ForgotPasswordDtoValidator : AbstractValidator<ForgotPasswordDto>
    {
        public ForgotPasswordDtoValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Email is not valid")
                .MaximumLength(254).WithMessage("Email must not exceed 254 characters");
        }
    }
}
