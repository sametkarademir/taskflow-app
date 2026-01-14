using TaskFlow.Domain.Shared.BaseEntities.Abstractions;
using TaskFlow.Domain.TodoItems;
using TaskFlow.Domain.Users;

namespace TaskFlow.Domain.Categories;

public class Category : FullAuditedEntity<Guid>
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? ColorHex { get; set; }
    
    public Guid UserId { get; set; }
    public virtual User? User { get; set; }
    
    public virtual ICollection<TodoItem> TodoItems { get; set; } = [];
}

