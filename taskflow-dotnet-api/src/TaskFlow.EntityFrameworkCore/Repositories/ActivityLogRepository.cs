using TaskFlow.Domain.ActivityLogs;
using TaskFlow.Domain.Repositories;
using TaskFlow.EntityFrameworkCore.Contexts;
using TaskFlow.EntityFrameworkCore.Repositories.Common;

namespace TaskFlow.EntityFrameworkCore.Repositories;

public class ActivityLogRepository(ApplicationDbContext context)
    : EfRepositoryBase<ActivityLog, Guid, ApplicationDbContext>(context), IActivityLogRepository
{
}

