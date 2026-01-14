using TaskFlow.Domain.Repositories;
using TaskFlow.Domain.TodoItems;
using TaskFlow.EntityFrameworkCore.Contexts;
using TaskFlow.EntityFrameworkCore.Repositories.Common;

namespace TaskFlow.EntityFrameworkCore.Repositories;

public class TodoItemRepository(ApplicationDbContext context)
    : EfRepositoryBase<TodoItem, Guid, ApplicationDbContext>(context), ITodoItemRepository
{
}

