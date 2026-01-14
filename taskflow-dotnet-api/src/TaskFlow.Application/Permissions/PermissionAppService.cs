using AutoMapper;
using TaskFlow.Application.Contracts.Permissions;
using TaskFlow.Domain.Repositories;

namespace TaskFlow.Application.Permissions;

public class PermissionAppService(
    IPermissionRepository permissionRepository,
    IMapper mapper)
    : IPermissionAppService
{
    public async Task<List<PermissionResponseDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var matchedPermissions = await permissionRepository.GetAllAsync(
            orderBy: q => q.OrderBy(p => p.NormalizedName),
            enableTracking: false,
            cancellationToken: cancellationToken
        );

        return mapper.Map<List<PermissionResponseDto>>(matchedPermissions);
    }
}