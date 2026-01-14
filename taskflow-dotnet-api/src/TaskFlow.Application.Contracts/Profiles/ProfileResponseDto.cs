using TaskFlow.Application.Contracts.Permissions;
using TaskFlow.Application.Contracts.Roles;

namespace TaskFlow.Application.Contracts.Profiles;

public class ProfileResponseDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = null!;
    public string? PhoneNumber { get; set; }
    
    public bool EmailConfirmed { get; set; }
    public bool PhoneNumberConfirmed { get; set; }
    public bool TwoFactorEnabled { get; set; }
    public bool IsActive { get; set; }
    
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime? PasswordChangedTime { get; set; }

    public List<string> Roles { get; set; } = [];
    public List<string> Permissions { get; set; } = [];
}