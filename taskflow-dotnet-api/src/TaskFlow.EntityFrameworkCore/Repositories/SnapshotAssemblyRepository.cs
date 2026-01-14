using TaskFlow.Domain.Repositories;
using TaskFlow.Domain.SnapshotAssemblies;
using TaskFlow.EntityFrameworkCore.Contexts;
using TaskFlow.EntityFrameworkCore.Repositories.Common;

namespace TaskFlow.EntityFrameworkCore.Repositories;

public class SnapshotAssemblyRepository(ApplicationDbContext dbContext)
    : EfRepositoryBase<SnapshotAssembly, Guid, ApplicationDbContext>(dbContext), ISnapshotAssemblyRepository;