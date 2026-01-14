using TaskFlow.Domain.Shared.BaseEntities.Abstractions;
using TaskFlow.Domain.Shared.ConfirmationCodes;
using TaskFlow.Domain.Users;

namespace TaskFlow.Domain.ConfirmationCodes;

public class ConfirmationCode : FullAuditedEntity<Guid>
{
    public string Code { get; set; } = null!;
    public ConfirmationCodeTypes Type { get; set; }
    public DateTime ExpiryTime { get; set; }

    public bool IsUsed { get; set; }
    public DateTime? UsedTime { get; set; }

    public Guid UserId { get; set; }
    public virtual User? User { get; set; }
}