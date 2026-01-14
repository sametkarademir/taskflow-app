using TaskFlow.Application.Contracts.Common.Results;

namespace TaskFlow.Application.Contracts.ActivityLogs;

public interface IActivityLogAppService
{
    Task<PagedResult<ActivityLogResponseDto>> GetPagedAndFilterAsync(Guid todoItemId, GetListActivityLogsRequestDto request, CancellationToken cancellationToken = default);
}

