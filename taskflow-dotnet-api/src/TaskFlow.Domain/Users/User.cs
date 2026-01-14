using TaskFlow.Domain.ActivityLogs;
using TaskFlow.Domain.Categories;
using TaskFlow.Domain.ConfirmationCodes;
using TaskFlow.Domain.RefreshTokens;
using TaskFlow.Domain.Sessions;
using TaskFlow.Domain.Shared.BaseEntities.Abstractions;
using TaskFlow.Domain.TodoComments;
using TaskFlow.Domain.TodoItems;
using TaskFlow.Domain.UserRoles;

namespace TaskFlow.Domain.Users;

public class User : FullAuditedEntity<Guid>
{
    public string Email { get; set; } = null!;
    public string NormalizedEmail { get; set; } = null!;
    public bool EmailConfirmed { get; set; }

    public string PasswordHash { get; set; } = null!;

    public string? PhoneNumber { get; set; }
    public bool PhoneNumberConfirmed { get; set; }

    public bool TwoFactorEnabled { get; set; }

    public DateTimeOffset? LockoutEnd { get; set; }
    public bool LockoutEnabled { get; set; }
    public int AccessFailedCount { get; set; }

    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime? PasswordChangedTime { get; set; }
    public bool IsActive { get; set; } = true;
    
    public virtual ICollection<UserRole> UserRoles { get; set; } = [];
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = [];
    public virtual ICollection<Session> Sessions { get; set; } = [];
    public virtual ICollection<ConfirmationCode> ConfirmationCodes { get; set; } = [];
    public virtual ICollection<Category> Categories { get; set; } = [];
    public virtual ICollection<TodoItem> TodoItems { get; set; } = [];
    public virtual ICollection<TodoComment> TodoComments { get; set; } = [];
    public virtual ICollection<ActivityLog> ActivityLogs { get; set; } = [];
}