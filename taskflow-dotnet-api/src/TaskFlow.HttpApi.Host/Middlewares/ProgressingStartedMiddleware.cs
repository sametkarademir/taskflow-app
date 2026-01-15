using TaskFlow.Domain.Repositories;
using TaskFlow.Domain.Shared.Extensions;
using TaskFlow.Domain.SnapshotLogs;
using Microsoft.Extensions.Caching.Memory;

namespace TaskFlow.HttpApi.Host.Middlewares;

public class ProgressingStartedMiddleware(
    RequestDelegate next, 
    IMemoryCache memoryCache, 
    ILogger<ProgressingStartedMiddleware> logger)
{
    public async Task Invoke(HttpContext context)
    {
        try
        {
            var correlationId = context.GetCorrelationId();
            if (correlationId == null)
            {
                context.SetCorrelationId(Guid.NewGuid());
            }
        }
        catch (Exception)
        {
            // ignored
        }

        try
        {
            var sessionId = context.User.GetSessionId();
            if (sessionId != null)
            {
                context.SetSessionId((Guid)sessionId);
            }
        }
        catch (Exception e)
        {
            // ignored
        }

        try
        {
            if (!memoryCache.TryGetValue(nameof(SnapshotLog), out Guid latestSnapshotId))
            {
                var snapshotLogRepository = context.RequestServices.GetRequiredService<ISnapshotLogRepository>();
                var matchedSnapshotLog = await snapshotLogRepository.GetLatestSnapshotLogAsync();
                latestSnapshotId = matchedSnapshotLog?.Id ?? Guid.Empty;
                memoryCache.Set(nameof(SnapshotLog), latestSnapshotId);
            }

            context.SetSnapshotId(latestSnapshotId);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error while setting snapshot id");
        }

        await next(context);
    }
}