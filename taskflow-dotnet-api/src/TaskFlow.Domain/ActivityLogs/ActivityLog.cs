using TaskFlow.Domain.Shared.BaseEntities.Abstractions;
using TaskFlow.Domain.TodoItems;
using TaskFlow.Domain.Users;

namespace TaskFlow.Domain.ActivityLogs;

public class ActivityLog : FullAuditedEntity<Guid>
{
    public string ActionKey { get; set; } = null!;
    
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    
    public Guid UserId { get; set; }
    public virtual User? User { get; set; }
    
    public Guid TodoItemId { get; set; }
    public virtual TodoItem? TodoItem { get; set; }
}

