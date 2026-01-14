using TaskFlow.Domain.Shared.Attributes;
using TaskFlow.Domain.Shared.BaseEntities.Abstractions;
using TaskFlow.Domain.SnapshotLogs;

namespace TaskFlow.Domain.SnapshotAssemblies;

[DisableAuditLog]
public class SnapshotAssembly : CreationAuditedEntity<Guid>
{
    public string? Name { get; set; }
    public string? Version { get; set; }
    public string? Culture { get; set; }
    public string? PublicKeyToken { get; set; }
    public string? Location { get; set; }

    public Guid SnapshotLogId { get; set; }
    public SnapshotLog? SnapshotLog { get; set; }
}