using TaskFlow.Domain.Permissions;
using TaskFlow.Domain.Roles;
using TaskFlow.Domain.Shared.BaseEntities.Abstractions;

namespace TaskFlow.Domain.RolePermissions;

public class RolePermission : FullAuditedEntity<Guid>
{
    public Guid PermissionId { get; set; }
    public virtual Permission? Permission { get; set; }
    
    public Guid RoleId { get; set; }
    public virtual Role? Role { get; set; }
}