using TaskFlow.Domain.Repositories;
using TaskFlow.Domain.RolePermissions;
using TaskFlow.EntityFrameworkCore.Contexts;
using TaskFlow.EntityFrameworkCore.Repositories.Common;

namespace TaskFlow.EntityFrameworkCore.Repositories;

public class RolePermissionRepository(ApplicationDbContext context)
    : EfRepositoryBase<RolePermission, Guid, ApplicationDbContext>(context), IRolePermissionRepository;