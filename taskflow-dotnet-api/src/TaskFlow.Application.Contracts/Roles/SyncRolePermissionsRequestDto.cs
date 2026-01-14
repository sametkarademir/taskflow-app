namespace TaskFlow.Application.Contracts.Roles;

public class SyncRolePermissionsRequestDto
{
    public List<Guid> PermissionIds { get; set; } = new();
}

