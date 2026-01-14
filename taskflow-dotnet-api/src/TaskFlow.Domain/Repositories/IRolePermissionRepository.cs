using TaskFlow.Domain.RolePermissions;
using TaskFlow.Domain.Shared.Repositories;

namespace TaskFlow.Domain.Repositories;

public interface IRolePermissionRepository : IRepository<RolePermission, Guid>
{

}