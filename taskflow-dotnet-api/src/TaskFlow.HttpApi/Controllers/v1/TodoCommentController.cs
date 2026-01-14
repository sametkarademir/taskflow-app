using TaskFlow.Application.Contracts.Common.Results;
using TaskFlow.Application.Contracts.TodoComments;
using TaskFlow.Domain.Shared.Permissions;
using TaskFlow.HttpApi.Attributes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace TaskFlow.HttpApi.Controllers.v1;

[ApiController]
[Route("api/v1/todo-items/{todoItemId:guid}/comments")]
[Authorize]
[EnableRateLimiting("api")]
public class TodoCommentController : ControllerBase
{
    private readonly ITodoCommentAppService _todoCommentAppService;

    public TodoCommentController(ITodoCommentAppService todoCommentAppService)
    {
        _todoCommentAppService = todoCommentAppService;
    }

    [HttpGet("paged")]
    [ProducesResponseType(typeof(PagedResult<TodoCommentResponseDto>), StatusCodes.Status200OK)]
    [PermissionAuthorize(PermissionConsts.TodoComment.Paged)]
    public async Task<IActionResult> GetPagedAndFilterAsync(
        [FromRoute(Name = "todoItemId")] Guid todoItemId,
        [FromQuery] GetListTodoCommentsRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var response = await _todoCommentAppService.GetPagedAndFilterAsync(todoItemId, request, cancellationToken);
        return Ok(response);
    }
    
    [HttpPost]
    [ProducesResponseType(typeof(TodoCommentResponseDto), StatusCodes.Status200OK)]
    [PermissionAuthorize(PermissionConsts.TodoComment.Create)]
    public async Task<IActionResult> CreateAsync(
        [FromRoute(Name = "todoItemId")] Guid todoItemId,
        [FromBody] CreateTodoCommentRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var response = await _todoCommentAppService.CreateAsync(todoItemId, request, cancellationToken);
        return Ok(response);
    }
}

