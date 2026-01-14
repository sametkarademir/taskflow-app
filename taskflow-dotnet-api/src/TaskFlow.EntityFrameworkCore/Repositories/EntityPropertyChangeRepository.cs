using TaskFlow.Domain.EntityPropertyChanges;
using TaskFlow.Domain.Repositories;
using TaskFlow.EntityFrameworkCore.Contexts;
using TaskFlow.EntityFrameworkCore.Repositories.Common;

namespace TaskFlow.EntityFrameworkCore.Repositories;

public class EntityPropertyChangeRepository(ApplicationDbContext dbContext)
    : EfRepositoryBase<EntityPropertyChange, Guid, ApplicationDbContext>(dbContext), IEntityPropertyChangeRepository;