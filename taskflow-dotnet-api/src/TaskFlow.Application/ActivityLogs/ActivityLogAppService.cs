using AutoMapper;
using TaskFlow.Application.Contracts.ActivityLogs;
using TaskFlow.Application.Contracts.Common.Results;
using TaskFlow.Application.Contracts.Users;
using TaskFlow.Domain.ActivityLogs;
using TaskFlow.Domain.Repositories;
using TaskFlow.Domain.Shared.BaseEntities.Abstractions;
using TaskFlow.Domain.Shared.Exceptions.Types;
using TaskFlow.Domain.Shared.Extensions;
using TaskFlow.Domain.Shared.Localization;
using TaskFlow.Domain.Shared.Repositories;
using Microsoft.Extensions.Localization;

namespace TaskFlow.Application.ActivityLogs;

public class ActivityLogAppService : IActivityLogAppService
{
    private readonly IActivityLogRepository _activityLogRepository;
    private readonly IMapper _mapper;
    private readonly ICurrentUser _currentUser;

    public ActivityLogAppService(
        IActivityLogRepository activityLogRepository,
        IMapper mapper,
        ICurrentUser currentUser)
    {
        _activityLogRepository = activityLogRepository;
        _mapper = mapper;
        _currentUser = currentUser;

        if (!_currentUser.IsAuthenticated || _currentUser.Id == null)
        {
            throw new AppUnauthorizedException();
        }
    }

    public async Task<PagedResult<ActivityLogResponseDto>> GetPagedAndFilterAsync(Guid todoItemId, GetListActivityLogsRequestDto request, CancellationToken cancellationToken = default)
    {
        var pagedActivityLogs = await _activityLogRepository.GetListSortedAsync(
            page: request.Page,
            perPage: request.PerPage,
            predicate: al => al.TodoItemId == todoItemId && al.UserId == _currentUser.Id,
            sort: request.GetSortRequest(nameof(CreationAuditedEntity<Guid>.CreationTime)),
            enableTracking: false,
            cancellationToken: cancellationToken
        );

        var mappedActivityLogs = _mapper.Map<List<ActivityLogResponseDto>>(pagedActivityLogs.Data);

        return new PagedResult<ActivityLogResponseDto>(mappedActivityLogs, pagedActivityLogs.TotalCount, pagedActivityLogs.Page, pagedActivityLogs.PerPage);
    }
}

