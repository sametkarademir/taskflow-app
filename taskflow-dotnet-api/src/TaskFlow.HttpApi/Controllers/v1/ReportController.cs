using TaskFlow.Application.Contracts.Reports;
using TaskFlow.Domain.Shared.Permissions;
using TaskFlow.HttpApi.Attributes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace TaskFlow.HttpApi.Controllers.v1;

[ApiController]
[Route("api/v1/reports")]
[Authorize]
[EnableRateLimiting("api")]
public class ReportController : ControllerBase
{
    private readonly IReportAppService _reportAppService;

    public ReportController(IReportAppService reportAppService)
    {
        _reportAppService = reportAppService;
    }
    
    [HttpGet("dashboard-statistics")]
    [ProducesResponseType(typeof(DashboardStatisticsResponseDto), StatusCodes.Status200OK)]
    [PermissionAuthorize(PermissionConsts.TodoItem.GetList)]
    public async Task<IActionResult> GetDashboardStatisticsAsync([FromQuery] DashboardStatisticsRequestDto request, CancellationToken cancellationToken = default)
    {
        var response = await _reportAppService.GetDashboardStatisticsAsync(request, cancellationToken);
        return Ok(response);
    }
}
