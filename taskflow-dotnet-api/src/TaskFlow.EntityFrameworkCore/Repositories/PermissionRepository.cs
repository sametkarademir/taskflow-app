using TaskFlow.Domain.Permissions;
using TaskFlow.Domain.Repositories;
using TaskFlow.EntityFrameworkCore.Contexts;
using TaskFlow.EntityFrameworkCore.Repositories.Common;

namespace TaskFlow.EntityFrameworkCore.Repositories;

public class PermissionRepository(ApplicationDbContext dbContext)
    : EfRepositoryBase<Permission, Guid, ApplicationDbContext>(dbContext), IPermissionRepository;