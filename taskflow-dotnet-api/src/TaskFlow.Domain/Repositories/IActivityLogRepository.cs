using TaskFlow.Domain.ActivityLogs;
using TaskFlow.Domain.Shared.Repositories;

namespace TaskFlow.Domain.Repositories;

public interface IActivityLogRepository : IRepository<ActivityLog, Guid>
{
}

