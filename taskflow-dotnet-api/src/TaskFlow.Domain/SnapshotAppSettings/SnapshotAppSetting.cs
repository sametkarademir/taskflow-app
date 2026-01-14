using TaskFlow.Domain.Shared.Attributes;
using TaskFlow.Domain.Shared.BaseEntities.Abstractions;
using TaskFlow.Domain.SnapshotLogs;

namespace TaskFlow.Domain.SnapshotAppSettings;

[DisableAuditLog]
public class SnapshotAppSetting : CreationAuditedEntity<Guid>
{
    public string Key { get; set; } = null!;
    public string Value { get; set; } = null!;

    public Guid SnapshotLogId { get; set; }
    public SnapshotLog? SnapshotLog { get; set; }
}