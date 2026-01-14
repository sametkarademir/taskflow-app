using TaskFlow.Application.Contracts.BaseEntities;
using TaskFlow.Application.Contracts.Categories;
using TaskFlow.Application.Contracts.Profiles;
using TaskFlow.Domain.Shared.TodoItems;

namespace TaskFlow.Application.Contracts.TodoItems;

public class TodoItemResponseDto : EntityDto<Guid>
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public TodoStatus Status { get; set; }
    public TodoPriority Priority { get; set; }
    public DateTime? DueDate { get; set; }
    public bool IsArchived { get; set; }
    public DateTime? ArchivedTime { get; set; }
    
    public Guid CategoryId { get; set; }
    public CategoryResponseDto? Category { get; set; }
    
    public Guid UserId { get; set; }
}

