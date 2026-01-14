using TaskFlow.Domain.Roles;
using TaskFlow.Domain.Shared.BaseEntities.Abstractions;
using TaskFlow.Domain.Users;

namespace TaskFlow.Domain.UserRoles;

public class UserRole : FullAuditedEntity<Guid>
{
    public Guid UserId { get; set; }
    public virtual User? User { get; set; }

    public Guid RoleId { get; set; }
    public virtual Role? Role { get; set; }
}