using Api.Dto;
using FluentValidation;

namespace Api.Validators
{
    public class CreateDocumentDtoValidator : AbstractValidator<CreateDocumentDto>
    {
        public CreateDocumentDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Document name is required")
                .MinimumLength(2).WithMessage("Document name must be at least 2 characters")
                .MaximumLength(200).WithMessage("Document name must not exceed 200 characters");

            RuleFor(x => x.Type)
                .NotEmpty().WithMessage("Document type is required")
                .MaximumLength(100).WithMessage("Document type must not exceed 100 characters");

            RuleFor(x => x.Version)
                .MaximumLength(100).WithMessage("Version must not exceed 100 characters")
                .When(x => !string.IsNullOrEmpty(x.Version));
        }
    }
}
