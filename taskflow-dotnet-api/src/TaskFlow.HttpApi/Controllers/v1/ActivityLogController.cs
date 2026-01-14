using TaskFlow.Application.Contracts.ActivityLogs;
using TaskFlow.Application.Contracts.Common.Results;
using TaskFlow.Domain.Shared.Permissions;
using TaskFlow.HttpApi.Attributes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace TaskFlow.HttpApi.Controllers.v1;

[ApiController]
[Route("api/v1/todo-items/{todoItemId:guid}/activity-logs")]
[Authorize]
[EnableRateLimiting("api")]
public class ActivityLogController : ControllerBase
{
    private readonly IActivityLogAppService _activityLogAppService;

    public ActivityLogController(IActivityLogAppService activityLogAppService)
    {
        _activityLogAppService = activityLogAppService;
    }
    
    [HttpGet("paged")]
    [ProducesResponseType(typeof(PagedResult<ActivityLogResponseDto>), StatusCodes.Status200OK)]
    [PermissionAuthorize(PermissionConsts.ActivityLog.Paged)]
    public async Task<IActionResult> GetPagedAndFilterAsync(
        [FromRoute(Name = "todoItemId")] Guid todoItemId,
        [FromQuery] GetListActivityLogsRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var response = await _activityLogAppService.GetPagedAndFilterAsync(todoItemId, request, cancellationToken);
        return Ok(response);
    }
}

