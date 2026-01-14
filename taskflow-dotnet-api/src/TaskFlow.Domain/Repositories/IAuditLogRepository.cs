using TaskFlow.Domain.AuditLogs;
using TaskFlow.Domain.Shared.Repositories;

namespace TaskFlow.Domain.Repositories;

public interface IAuditLogRepository : IRepository<AuditLog, Guid>
{
}