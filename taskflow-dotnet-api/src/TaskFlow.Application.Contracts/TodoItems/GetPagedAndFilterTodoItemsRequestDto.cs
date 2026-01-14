using TaskFlow.Application.Contracts.Common;
using TaskFlow.Domain.Shared.Localization;
using TaskFlow.Domain.Shared.TodoItems;
using FluentValidation;
using Microsoft.Extensions.Localization;

namespace TaskFlow.Application.Contracts.TodoItems;

public class GetPagedAndFilterTodoItemsRequestDto : GetListRequestDto
{
    public bool? IsArchived { get; set; }
    public TodoStatus? Status { get; set; }
    public TodoPriority? Priority { get; set; }
    public Guid? CategoryId { get; set; }
}

public class GetPagedAndFilterTodoItemsRequestDtoValidator : AbstractValidator<GetPagedAndFilterTodoItemsRequestDto>
{
    public GetPagedAndFilterTodoItemsRequestDtoValidator(IStringLocalizer<ApplicationResource> localizer)
    {
        Include(new GetListRequestDtoValidator(localizer));
    }
}

