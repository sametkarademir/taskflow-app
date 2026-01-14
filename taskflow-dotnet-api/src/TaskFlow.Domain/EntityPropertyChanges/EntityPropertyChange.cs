using TaskFlow.Domain.AuditLogs;
using TaskFlow.Domain.Shared.Attributes;
using TaskFlow.Domain.Shared.BaseEntities.Abstractions;

namespace TaskFlow.Domain.EntityPropertyChanges;

[DisableAuditLog]
public class EntityPropertyChange : CreationAuditedEntity<Guid>
{
    public string PropertyName { get; set; } = null!;
    public string PropertyTypeFullName { get; set; } = null!;
    public string? NewValue { get; set; }
    public string? OriginalValue { get; set; }

    public Guid AuditLogId { get; set; }
    public AuditLog? AuditLog { get; set; }
}