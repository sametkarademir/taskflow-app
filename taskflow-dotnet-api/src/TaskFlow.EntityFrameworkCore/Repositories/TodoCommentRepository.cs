using TaskFlow.Domain.Repositories;
using TaskFlow.Domain.TodoComments;
using TaskFlow.EntityFrameworkCore.Contexts;
using TaskFlow.EntityFrameworkCore.Repositories.Common;

namespace TaskFlow.EntityFrameworkCore.Repositories;

public class TodoCommentRepository(ApplicationDbContext context)
    : EfRepositoryBase<TodoComment, Guid, ApplicationDbContext>(context), ITodoCommentRepository
{
}

