using TaskFlow.Domain.HttpRequestLogs;
using TaskFlow.Domain.Repositories;
using TaskFlow.EntityFrameworkCore.Contexts;
using TaskFlow.EntityFrameworkCore.Repositories.Common;

namespace TaskFlow.EntityFrameworkCore.Repositories;

public class HttpRequestLogRepository(ApplicationDbContext dbContext)
    : EfRepositoryBase<HttpRequestLog, Guid, ApplicationDbContext>(dbContext), IHttpRequestLogRepository;