using TaskFlow.Domain.Shared.Repositories;
using TaskFlow.Domain.SnapshotAssemblies;

namespace TaskFlow.Domain.Repositories;

public interface ISnapshotAssemblyRepository : IRepository<SnapshotAssembly, Guid>
{
}