using Api.Dto;
using FluentValidation;

namespace Api.Validators
{
    public class LinkDocumentDtoValidator : AbstractValidator<LinkDocumentDto>
    {
        public LinkDocumentDtoValidator()
        {
            RuleFor(x => x.DocumentId)
                .MaximumLength(200).WithMessage("Document ID must not exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.DocumentId));
        }
    }
}
