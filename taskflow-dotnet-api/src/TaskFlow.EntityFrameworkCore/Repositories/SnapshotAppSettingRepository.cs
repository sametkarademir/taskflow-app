using TaskFlow.Domain.Repositories;
using TaskFlow.Domain.SnapshotAppSettings;
using TaskFlow.EntityFrameworkCore.Contexts;
using TaskFlow.EntityFrameworkCore.Repositories.Common;

namespace TaskFlow.EntityFrameworkCore.Repositories;

public class SnapshotAppSettingRepository(ApplicationDbContext dbContext)
    : EfRepositoryBase<SnapshotAppSetting, Guid, ApplicationDbContext>(dbContext), ISnapshotAppSettingRepository;