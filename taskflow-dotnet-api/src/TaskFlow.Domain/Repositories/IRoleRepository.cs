using TaskFlow.Domain.Roles;
using TaskFlow.Domain.Shared.Repositories;

namespace TaskFlow.Domain.Repositories;

public interface IRoleRepository : IRepository<Role, Guid>
{
    Task<bool> ExistsByNameAsync(
        string name,
        Guid? id = null,
        CancellationToken cancellationToken = default
    );
    
    Task<Role?> FindByNameAsync(
        string name,
        CancellationToken cancellationToken = default
    );
}