using TaskFlow.Application.Contracts.Common.Results;

namespace TaskFlow.Application.Contracts.TodoComments;

public interface ITodoCommentAppService
{
    Task<TodoCommentResponseDto> CreateAsync(Guid todoItemId, CreateTodoCommentRequestDto request, CancellationToken cancellationToken = default);
    Task<PagedResult<TodoCommentResponseDto>> GetPagedAndFilterAsync(Guid todoItemId, GetListTodoCommentsRequestDto request, CancellationToken cancellationToken = default);
}

