using TaskFlow.Domain.Categories;
using TaskFlow.Domain.Shared.Repositories;

namespace TaskFlow.Domain.Repositories;

public interface ICategoryRepository : IRepository<Category, Guid>
{
}

