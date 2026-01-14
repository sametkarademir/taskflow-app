using TaskFlow.Domain.Categories;
using TaskFlow.Domain.Repositories;
using TaskFlow.EntityFrameworkCore.Contexts;
using TaskFlow.EntityFrameworkCore.Repositories.Common;

namespace TaskFlow.EntityFrameworkCore.Repositories;

public class CategoryRepository(ApplicationDbContext context)
    : EfRepositoryBase<Category, Guid, ApplicationDbContext>(context), ICategoryRepository
{
}

