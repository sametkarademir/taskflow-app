using TaskFlow.Application.Contracts.BaseEntities;

namespace TaskFlow.Application.Contracts.Permissions;

public class PermissionResponseDto : EntityDto<Guid>
{
    public string Name { get; set; } = null!;
}