using TaskFlow.Domain.Shared.BaseEntities.Abstractions;
using TaskFlow.Domain.TodoItems;
using TaskFlow.Domain.Users;

namespace TaskFlow.Domain.TodoComments;

public class TodoComment : FullAuditedEntity<Guid>
{
    public string Content { get; set; } = null!;
    
    public Guid TodoItemId { get; set; }
    public virtual TodoItem? TodoItem { get; set; }
    
    public Guid UserId { get; set; }
    public virtual User? User { get; set; }
}

