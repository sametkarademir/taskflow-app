using TaskFlow.Application.Contracts.BaseEntities;

namespace TaskFlow.Application.Contracts.TodoComments;

public class TodoCommentResponseDto : CreationAuditedEntityDto<Guid>
{
    public string Content { get; set; } = null!;
    public Guid UserId { get; set; }
    public Guid TodoItemId { get; set; }
}

