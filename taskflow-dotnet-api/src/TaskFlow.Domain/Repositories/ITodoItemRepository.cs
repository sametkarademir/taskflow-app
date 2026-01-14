using TaskFlow.Domain.Shared.Repositories;
using TaskFlow.Domain.TodoItems;

namespace TaskFlow.Domain.Repositories;

public interface ITodoItemRepository : IRepository<TodoItem, Guid>
{
}

