using TaskFlow.Domain.ActivityLogs;
using TaskFlow.Domain.Categories;
using TaskFlow.Domain.Shared.BaseEntities.Abstractions;
using TaskFlow.Domain.Shared.TodoItems;
using TaskFlow.Domain.TodoComments;
using TaskFlow.Domain.Users;

namespace TaskFlow.Domain.TodoItems;

public class TodoItem : FullAuditedEntity<Guid>
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    
    public TodoStatus Status { get; set; }
    public TodoPriority Priority { get; set; }
    
    public DateTime? DueDate { get; set; }
    public bool IsArchived { get; set; } = false;
    public DateTime? ArchivedTime { get; set; }

    public Guid CategoryId { get; set; }
    public virtual Category? Category { get; set; }
    
    public Guid UserId { get; set; }
    public virtual User? User { get; set; }

    public virtual ICollection<TodoComment> Comments { get; set; } = [];
    public virtual ICollection<ActivityLog> Activities { get; set; } = [];
}

