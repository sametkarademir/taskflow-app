using TaskFlow.Domain.EntityPropertyChanges;
using TaskFlow.Domain.Shared.Repositories;

namespace TaskFlow.Domain.Repositories;

public interface IEntityPropertyChangeRepository : IRepository<EntityPropertyChange, Guid>
{
}