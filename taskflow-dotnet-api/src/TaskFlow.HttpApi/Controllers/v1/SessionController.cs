using TaskFlow.Application.Contracts.Common.Results;
using TaskFlow.Application.Contracts.Sessions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace TaskFlow.HttpApi.Controllers.v1;

[ApiController]
[Route("api/v1/sessions")]
[Authorize]
[EnableRateLimiting("api")]
public class SessionController : ControllerBase
{
    private readonly ISessionAppService _sessionAppService;

    public SessionController(ISessionAppService sessionAppService)
    {
        _sessionAppService = sessionAppService;
    }
    
    [HttpGet("paged")]
    [ProducesResponseType(typeof(PagedResult<SessionResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPageableAndFilterAsync([FromQuery] GetListSessionsRequestDto request, CancellationToken cancellationToken = default)
    {
        var response = await _sessionAppService.GetPageableAndFilterAsync(request, cancellationToken);
        return Ok(response);
    }
    
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> InvalidateSessionAsync([FromRoute(Name = "id")] Guid id, CancellationToken cancellationToken = default)
    {
        await _sessionAppService.InvalidateSessionAsync(id, cancellationToken);
        return NoContent();
    }
}