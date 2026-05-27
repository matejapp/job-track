using Api.Dto;
using FluentValidation;

namespace Api.Validators
{
    public class CreateActivityDtoValidator : AbstractValidator<CreateActivityDto>
    {
        public CreateActivityDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Activity name is required")
                .MaximumLength(200).WithMessage("Activity name must not exceed 200 characters");

            RuleFor(x => x.Description)
                .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters");

            RuleFor(x => x.Importance)
                .IsInEnum().WithMessage("Importance must be Low, Medium, High, or Urgent");

            RuleFor(x => x.Date)
                .NotEqual(default(DateTime)).WithMessage("Date is required");
        }
    }
}
