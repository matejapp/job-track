using Api.Dto;
using FluentValidation;

namespace Api.Validators
{
    public class ResetPasswordDtoValidator : AbstractValidator<ResetPasswordDto>
    {
        public ResetPasswordDtoValidator()
        {
            RuleFor(x => x.Token)
                .NotEmpty().WithMessage("Token is required")
                .MaximumLength(1000).WithMessage("Token must not exceed 1000 characters");

            RuleFor(x => x.NewPassword)
                .NotEmpty().WithMessage("New password is required")
                .MinimumLength(8).WithMessage("New password must be at least 8 characters")
                .MaximumLength(100).WithMessage("New password must not exceed 100 characters");
        }
    }
}
