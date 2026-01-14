using TaskFlow.Domain.RolePermissions;
using TaskFlow.Domain.Shared.BaseEntities.Abstractions;

namespace TaskFlow.Domain.Permissions;

public class Permission : FullAuditedEntity<Guid>
{
    public string Name { get; set; } = null!;
    public string NormalizedName { get; set; } = null!;
    
    public virtual ICollection<RolePermission> RolePermissions { get; set; } = [];
}