using TaskFlow.Domain.Shared.Repositories;
using TaskFlow.Domain.SnapshotAppSettings;

namespace TaskFlow.Domain.Repositories;

public interface ISnapshotAppSettingRepository : IRepository<SnapshotAppSetting, Guid>
{
}