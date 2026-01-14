using TaskFlow.Application.Contracts.Permissions;
using TaskFlow.Domain.Shared.Permissions;
using TaskFlow.HttpApi.Attributes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace TaskFlow.HttpApi.Controllers.v1;

[ApiController]
[Route("api/v1/permissions")]
[Authorize]
[EnableRateLimiting("api")]
public class PermissionController : ControllerBase
{
    private readonly IPermissionAppService _permissionAppService;

    public PermissionController(IPermissionAppService permissionAppService)
    {
        _permissionAppService = permissionAppService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<PermissionResponseDto>), StatusCodes.Status200OK)]
    [PermissionAuthorize(PermissionConsts.Permission.GetAll)]
    public async Task<IActionResult> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var response = await _permissionAppService.GetAllAsync(cancellationToken);
        return Ok(response);
    }
}