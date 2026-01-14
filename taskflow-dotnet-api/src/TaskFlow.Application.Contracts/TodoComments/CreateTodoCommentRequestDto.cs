using TaskFlow.Domain.Shared.Localization;
using TaskFlow.Domain.Shared.TodoComments;
using FluentValidation;
using Microsoft.Extensions.Localization;

namespace TaskFlow.Application.Contracts.TodoComments;

public class CreateTodoCommentRequestDto
{
    public string Content { get; set; } = null!;
}

public class CreateTodoCommentRequestDtoValidator : AbstractValidator<CreateTodoCommentRequestDto>
{
    public CreateTodoCommentRequestDtoValidator(IStringLocalizer<ApplicationResource> localizer)
    {
        RuleFor(item => item.Content)
            .NotEmpty().WithMessage(localizer["CreateTodoCommentRequestDto:Content:NotEmpty"])
            .MaximumLength(TodoCommentConsts.ContentMaxLength).WithMessage(localizer["CreateTodoCommentRequestDto:Content:MaxLength", TodoCommentConsts.ContentMaxLength]);
    }
}

