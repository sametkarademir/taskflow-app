using TaskFlow.Domain.RolePermissions;
using TaskFlow.Domain.Shared.BaseEntities.Abstractions;
using TaskFlow.Domain.UserRoles;

namespace TaskFlow.Domain.Roles;

public class Role : FullAuditedEntity<Guid>
{
    public string Name { get; set; } = null!;
    public string NormalizedName { get; set; } = null!;
    public string? Description { get; set; }
    
    public virtual ICollection<UserRole> UserRoles { get; set; } = [];
    public virtual ICollection<RolePermission> RolePermissions { get; set; } = [];
}