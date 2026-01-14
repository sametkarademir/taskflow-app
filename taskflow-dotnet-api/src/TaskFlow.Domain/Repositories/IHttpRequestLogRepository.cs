using TaskFlow.Domain.HttpRequestLogs;
using TaskFlow.Domain.Shared.Repositories;

namespace TaskFlow.Domain.Repositories;

public interface IHttpRequestLogRepository : IRepository<HttpRequestLog, Guid>
{
}