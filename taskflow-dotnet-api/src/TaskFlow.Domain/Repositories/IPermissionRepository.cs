using TaskFlow.Domain.Permissions;
using TaskFlow.Domain.Shared.Repositories;

namespace TaskFlow.Domain.Repositories;

public interface IPermissionRepository : IRepository<Permission, Guid>
{
}