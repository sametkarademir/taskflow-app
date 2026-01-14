using TaskFlow.Domain.Shared.Localization;
using TaskFlow.Domain.Shared.TodoItems;
using FluentValidation;
using Microsoft.Extensions.Localization;

namespace TaskFlow.Application.Contracts.TodoItems;

public class CreateTodoItemRequestDto
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public TodoStatus Status { get; set; } = TodoStatus.Backlog;
    public TodoPriority Priority { get; set; } = TodoPriority.Medium;
    public DateTime? DueDate { get; set; }
    public Guid CategoryId { get; set; }
}

public class CreateTodoItemRequestDtoValidator : AbstractValidator<CreateTodoItemRequestDto>
{
    public CreateTodoItemRequestDtoValidator(IStringLocalizer<ApplicationResource> localizer)
    {
        RuleFor(item => item.Title)
            .NotEmpty().WithMessage(localizer["CreateTodoItemRequestDto:Title:NotEmpty"])
            .MaximumLength(TodoItemConsts.TitleMaxLength).WithMessage(localizer["CreateTodoItemRequestDto:Title:MaxLength", TodoItemConsts.TitleMaxLength]);
        
        RuleFor(item => item.Description)
            .MaximumLength(TodoItemConsts.DescriptionMaxLength).WithMessage(localizer["CreateTodoItemRequestDto:Description:MaxLength", TodoItemConsts.DescriptionMaxLength]);
        
        RuleFor(item => item.Status)
            .IsInEnum().WithMessage(localizer["CreateTodoItemRequestDto:Status:IsInEnum"]);
        
        RuleFor(item => item.Priority)
            .IsInEnum().WithMessage(localizer["CreateTodoItemRequestDto:Priority:IsInEnum"]);
        
        RuleFor(item => item.CategoryId)
            .NotEmpty().WithMessage(localizer["CreateTodoItemRequestDto:CategoryId:IsRequired"]);
    }
}

