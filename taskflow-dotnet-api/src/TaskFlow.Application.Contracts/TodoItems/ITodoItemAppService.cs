using TaskFlow.Application.Contracts.Common.Results;

namespace TaskFlow.Application.Contracts.TodoItems;

public interface ITodoItemAppService
{
    Task<TodoItemResponseDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<TodoItemColumnDto>> GetListAsync(GetListTodoItemsRequestDto? request = null, CancellationToken cancellationToken = default);
    Task<PagedResult<TodoItemResponseDto>> GetPagedAndFilterAsync(GetPagedAndFilterTodoItemsRequestDto request, CancellationToken cancellationToken = default);
    Task<TodoItemResponseDto> CreateAsync(CreateTodoItemRequestDto request, CancellationToken cancellationToken = default);
    Task<TodoItemResponseDto> UpdateAsync(Guid id, UpdateTodoItemRequestDto request, CancellationToken cancellationToken = default);
    Task<TodoItemResponseDto> UpdateStatusAsync(Guid id, UpdateTodoItemStatusRequestDto request, CancellationToken cancellationToken = default);
    Task<TodoItemResponseDto> ArchiveAsync(Guid id, CancellationToken cancellationToken = default);
    Task ArchiveCompletedAsync(CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}

