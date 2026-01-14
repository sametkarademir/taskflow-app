using TaskFlow.Application.Contracts.Common.Results;
using TaskFlow.Application.Contracts.TodoItems;
using TaskFlow.Domain.Shared.Permissions;
using TaskFlow.HttpApi.Attributes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace TaskFlow.HttpApi.Controllers.v1;

[ApiController]
[Route("api/v1/todo-items")]
[Authorize]
[EnableRateLimiting("api")]
public class TodoItemController : ControllerBase
{
    private readonly ITodoItemAppService _todoItemAppService;

    public TodoItemController(ITodoItemAppService todoItemAppService)
    {
        _todoItemAppService = todoItemAppService;
    }
    
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(TodoItemResponseDto), StatusCodes.Status200OK)]
    [PermissionAuthorize(PermissionConsts.TodoItem.GetById)]
    public async Task<IActionResult> GetByIdAsync([FromRoute(Name = "id")] Guid id, CancellationToken cancellationToken = default)
    {
        var response = await _todoItemAppService.GetByIdAsync(id, cancellationToken);
        return Ok(response);
    }
    
    [HttpGet("list")]
    [ProducesResponseType(typeof(List<TodoItemColumnDto>), StatusCodes.Status200OK)]
    [PermissionAuthorize(PermissionConsts.TodoItem.GetList)]
    public async Task<IActionResult> GetListAsync([FromQuery] GetListTodoItemsRequestDto? request = null, CancellationToken cancellationToken = default)
    {
        var response = await _todoItemAppService.GetListAsync(request, cancellationToken);
        return Ok(response);
    }
    
    [HttpGet("paged")]
    [ProducesResponseType(typeof(PagedResult<TodoItemResponseDto>), StatusCodes.Status200OK)]
    [PermissionAuthorize(PermissionConsts.TodoItem.Paged)]
    public async Task<IActionResult> GetPagedAndFilterAsync([FromQuery] GetPagedAndFilterTodoItemsRequestDto request, CancellationToken cancellationToken = default)
    {
        var response = await _todoItemAppService.GetPagedAndFilterAsync(request, cancellationToken);
        return Ok(response);
    }
    
    [HttpPost]
    [ProducesResponseType(typeof(TodoItemResponseDto), StatusCodes.Status200OK)]
    [PermissionAuthorize(PermissionConsts.TodoItem.Create)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateTodoItemRequestDto request, CancellationToken cancellationToken = default)
    {
        var response = await _todoItemAppService.CreateAsync(request, cancellationToken);
        return Ok(response);
    }
    
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(TodoItemResponseDto), StatusCodes.Status200OK)]
    [PermissionAuthorize(PermissionConsts.TodoItem.Update)]
    public async Task<IActionResult> UpdateAsync(
        [FromRoute(Name = "id")] Guid id,
        [FromBody] UpdateTodoItemRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var response = await _todoItemAppService.UpdateAsync(id, request, cancellationToken);
        return Ok(response);
    }
    
    [HttpPatch("{id:guid}/status")]
    [ProducesResponseType(typeof(TodoItemResponseDto), StatusCodes.Status200OK)]
    [PermissionAuthorize(PermissionConsts.TodoItem.UpdateStatus)]
    public async Task<IActionResult> UpdateStatusAsync(
        [FromRoute(Name = "id")] Guid id,
        [FromBody] UpdateTodoItemStatusRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var response = await _todoItemAppService.UpdateStatusAsync(id, request, cancellationToken);
        return Ok(response);
    }
    
    [HttpPatch("{id:guid}/archive")]
    [ProducesResponseType(typeof(TodoItemResponseDto), StatusCodes.Status200OK)]
    [PermissionAuthorize(PermissionConsts.TodoItem.Archive)]
    public async Task<IActionResult> ArchiveAsync([FromRoute(Name = "id")] Guid id, CancellationToken cancellationToken = default)
    {
        var response = await _todoItemAppService.ArchiveAsync(id, cancellationToken);
        return Ok(response);
    }
    
    [HttpPatch("archive-completed")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [PermissionAuthorize(PermissionConsts.TodoItem.ArchiveCompleted)]
    public async Task<IActionResult> ArchiveCompletedAsync(CancellationToken cancellationToken = default)
    {
        await _todoItemAppService.ArchiveCompletedAsync(cancellationToken);
        return NoContent();
    }
    
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [PermissionAuthorize(PermissionConsts.TodoItem.Delete)]
    public async Task<IActionResult> DeleteAsync([FromRoute(Name = "id")] Guid id, CancellationToken cancellationToken = default)
    {
        await _todoItemAppService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}

