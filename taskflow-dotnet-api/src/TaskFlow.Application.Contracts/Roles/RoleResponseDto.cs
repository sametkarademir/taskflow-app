using TaskFlow.Application.Contracts.BaseEntities;
using TaskFlow.Application.Contracts.Permissions;

namespace TaskFlow.Application.Contracts.Roles;

public class RoleResponseDto : EntityDto<Guid>
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }

    public List<PermissionResponseDto> Permissions { get; set; } = [];
}