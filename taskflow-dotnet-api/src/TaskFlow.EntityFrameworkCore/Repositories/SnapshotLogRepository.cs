using TaskFlow.Domain.Repositories;
using TaskFlow.Domain.SnapshotLogs;
using TaskFlow.EntityFrameworkCore.Contexts;
using TaskFlow.EntityFrameworkCore.Repositories.Common;
using Microsoft.EntityFrameworkCore;

namespace TaskFlow.EntityFrameworkCore.Repositories;

public class SnapshotLogRepository(ApplicationDbContext dbContext)
    : EfRepositoryBase<SnapshotLog, Guid, ApplicationDbContext>(dbContext), ISnapshotLogRepository
{
    public async Task<SnapshotLog?> GetLatestSnapshotLogAsync()
    {
        return await AsQueryable()
            .OrderByDescending(s => s.CreationTime)
            .FirstOrDefaultAsync();
    }
}