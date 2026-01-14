using TaskFlow.Application.Contracts.BaseEntities;

namespace TaskFlow.Application.Contracts.ActivityLogs;

public class ActivityLogResponseDto : CreationAuditedEntityDto<Guid>
{
    public string ActionKey { get; set; } = null!;
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    public Guid UserId { get; set; }
    public Guid TodoItemId { get; set; }
}

