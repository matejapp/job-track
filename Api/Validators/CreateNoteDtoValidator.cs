using Api.Dto;
using FluentValidation;

namespace Api.Validators
{
    public class CreateNoteDtoValidator : AbstractValidator<CreateNoteDto>
    {
        public CreateNoteDtoValidator()
        {
            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Note content is required")
                .MaximumLength(5000).WithMessage("Note content must not exceed 5000 characters");
        }
    }
}
