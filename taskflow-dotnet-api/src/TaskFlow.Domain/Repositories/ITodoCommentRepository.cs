using TaskFlow.Domain.Shared.Repositories;
using TaskFlow.Domain.TodoComments;

namespace TaskFlow.Domain.Repositories;

public interface ITodoCommentRepository : IRepository<TodoComment, Guid>
{
}

