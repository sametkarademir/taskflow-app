using TaskFlow.Domain.AuditLogs;
using TaskFlow.Domain.Repositories;
using TaskFlow.EntityFrameworkCore.Contexts;
using TaskFlow.EntityFrameworkCore.Repositories.Common;

namespace TaskFlow.EntityFrameworkCore.Repositories;

public class AuditLogRepository(ApplicationDbContext dbContext)
    : EfRepositoryBase<AuditLog, Guid, ApplicationDbContext>(dbContext), IAuditLogRepository;