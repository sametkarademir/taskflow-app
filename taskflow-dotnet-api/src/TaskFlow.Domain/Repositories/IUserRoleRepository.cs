using TaskFlow.Domain.Shared.Repositories;
using TaskFlow.Domain.UserRoles;

namespace TaskFlow.Domain.Repositories;

public interface IUserRoleRepository : IRepository<UserRole, Guid>
{
    Task<(List<string> Roles, List<string> Permissions)> GetRolesAndPermissionsByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    );

    Task<List<string>> GetRolesByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    );
}