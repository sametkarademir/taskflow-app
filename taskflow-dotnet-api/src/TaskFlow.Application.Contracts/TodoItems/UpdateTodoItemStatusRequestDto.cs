using TaskFlow.Domain.Shared.Localization;
using TaskFlow.Domain.Shared.TodoItems;
using FluentValidation;
using Microsoft.Extensions.Localization;

namespace TaskFlow.Application.Contracts.TodoItems;

public class UpdateTodoItemStatusRequestDto
{
    public TodoStatus Status { get; set; }
}

public class UpdateTodoItemStatusRequestDtoValidator : AbstractValidator<UpdateTodoItemStatusRequestDto>
{
    public UpdateTodoItemStatusRequestDtoValidator(IStringLocalizer<ApplicationResource> localizer)
    {
        RuleFor(item => item.Status)
            .IsInEnum().WithMessage(localizer["UpdateTodoItemStatusRequestDto:Status:IsInEnum"]);
    }
}

