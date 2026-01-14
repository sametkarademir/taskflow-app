using TaskFlow.Domain.EntityPropertyChanges;
using TaskFlow.Domain.Shared.Attributes;
using TaskFlow.Domain.Shared.BaseEntities.Abstractions;
using TaskFlow.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace TaskFlow.Domain.AuditLogs;

[DisableAuditLog]
public class AuditLog : CreationAuditedEntityWithUser<Guid, User>
{
    public string EntityId { get; set; } = null!;
    public string EntityName { get; set; } = null!;
    public EntityState State { get; set; }
    
    public Guid? SnapshotId { get; set; }
    public Guid? SessionId { get; set; }
    public Guid? CorrelationId { get; set; }

    public ICollection<EntityPropertyChange> EntityPropertyChanges { get; set; } = [];
}