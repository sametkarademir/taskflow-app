using TaskFlow.Domain.Shared.Repositories;
using TaskFlow.Domain.SnapshotLogs;

namespace TaskFlow.Domain.Repositories;

public interface ISnapshotLogRepository : IRepository<SnapshotLog, Guid>
{
    Task<SnapshotLog?> GetLatestSnapshotLogAsync();
}