using TaskFlow.Domain.Shared.Localization;
using TaskFlow.Domain.Shared.TodoItems;
using FluentValidation;
using Microsoft.Extensions.Localization;

namespace TaskFlow.Application.Contracts.TodoItems;

public class UpdateTodoItemRequestDto
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public TodoStatus Status { get; set; }
    public TodoPriority Priority { get; set; }
    public DateTime? DueDate { get; set; }
    public Guid CategoryId { get; set; }
}

public class UpdateTodoItemRequestDtoValidator : AbstractValidator<UpdateTodoItemRequestDto>
{
    public UpdateTodoItemRequestDtoValidator(IStringLocalizer<ApplicationResource> localizer)
    {
        RuleFor(item => item.Title)
            .NotEmpty().WithMessage(localizer["UpdateTodoItemRequestDto:Title:NotEmpty"])
            .MaximumLength(TodoItemConsts.TitleMaxLength).WithMessage(localizer["UpdateTodoItemRequestDto:Title:MaxLength", TodoItemConsts.TitleMaxLength]);
        
        RuleFor(item => item.Description)
            .MaximumLength(TodoItemConsts.DescriptionMaxLength).WithMessage(localizer["UpdateTodoItemRequestDto:Description:MaxLength", TodoItemConsts.DescriptionMaxLength]);
        
        RuleFor(item => item.Status)
            .IsInEnum().WithMessage(localizer["UpdateTodoItemRequestDto:Status:IsInEnum"]);
        
        RuleFor(item => item.Priority)
            .IsInEnum().WithMessage(localizer["UpdateTodoItemRequestDto:Priority:IsInEnum"]);
        
        RuleFor(item => item.CategoryId)
            .NotEmpty().WithMessage(localizer["UpdateTodoItemRequestDto:CategoryId:IsRequired"]);
    }
}

