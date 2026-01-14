using TaskFlow.Domain.Shared.TodoItems;

namespace TaskFlow.Application.Contracts.TodoItems;

public class GetListTodoItemsRequestDto
{
    public TodoStatus? Status { get; set; }
    public TodoPriority? Priority { get; set; }
    public Guid? CategoryId { get; set; }
}
