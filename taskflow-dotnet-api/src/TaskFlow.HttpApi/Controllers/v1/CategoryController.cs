using TaskFlow.Application.Contracts.Categories;
using TaskFlow.Application.Contracts.Common.Results;
using TaskFlow.Domain.Shared.Permissions;
using TaskFlow.HttpApi.Attributes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace TaskFlow.HttpApi.Controllers.v1;

[ApiController]
[Route("api/v1/categories")]
[Authorize]
[EnableRateLimiting("api")]
public class CategoryController : ControllerBase
{
    private readonly ICategoryAppService _categoryAppService;

    public CategoryController(ICategoryAppService categoryAppService)
    {
        _categoryAppService = categoryAppService;
    }
    
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(CategoryResponseDto), StatusCodes.Status200OK)]
    [PermissionAuthorize(PermissionConsts.Category.GetById)]
    public async Task<IActionResult> GetByIdAsync([FromRoute(Name = "id")] Guid id, CancellationToken cancellationToken = default)
    {
        var response = await _categoryAppService.GetByIdAsync(id, cancellationToken);
        return Ok(response);
    }
    
    [HttpGet("paged")]
    [ProducesResponseType(typeof(PagedResult<CategoryResponseDto>), StatusCodes.Status200OK)]
    [PermissionAuthorize(PermissionConsts.Category.Paged)]
    public async Task<IActionResult> GetPagedAndFilterAsync([FromQuery] GetListCategoriesRequestDto request, CancellationToken cancellationToken = default)
    {
        var response = await _categoryAppService.GetPagedAndFilterAsync(request, cancellationToken);
        return Ok(response);
    }
    
    [HttpPost]
    [ProducesResponseType(typeof(CategoryResponseDto), StatusCodes.Status200OK)]
    [PermissionAuthorize(PermissionConsts.Category.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateCategoryRequestDto request, CancellationToken cancellationToken = default)
    {
        var response = await _categoryAppService.CreateAsync(request, cancellationToken);
        return Ok(response);
    }
    
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(CategoryResponseDto), StatusCodes.Status200OK)]
    [PermissionAuthorize(PermissionConsts.Category.Update)]
    public async Task<IActionResult> UpdateAsync(
        [FromRoute(Name = "id")] Guid id,
        [FromBody] UpdateCategoryRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var response = await _categoryAppService.UpdateAsync(id, request, cancellationToken);
        return Ok(response);
    }
    
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [PermissionAuthorize(PermissionConsts.Category.Delete)]
    public async Task<IActionResult> DeleteAsync([FromRoute(Name = "id")] Guid id, CancellationToken cancellationToken = default)
    {
        await _categoryAppService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}

