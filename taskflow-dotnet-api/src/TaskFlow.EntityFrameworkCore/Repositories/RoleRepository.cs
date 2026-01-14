using TaskFlow.Domain.Repositories;
using TaskFlow.Domain.Roles;
using TaskFlow.Domain.Shared.Extensions;
using TaskFlow.EntityFrameworkCore.Contexts;
using TaskFlow.EntityFrameworkCore.Repositories.Common;
using Microsoft.EntityFrameworkCore;

namespace TaskFlow.EntityFrameworkCore.Repositories;

public class RoleRepository(ApplicationDbContext context)
    : EfRepositoryBase<Role, Guid, ApplicationDbContext>(context), IRoleRepository
{
    public async Task<bool> ExistsByNameAsync(string name, Guid? id = null, CancellationToken cancellationToken = default)
    {
        var normalizedRoleName = name.NormalizeValue();
        
        var queryable = AsQueryable();
        
        queryable = queryable.Where(r => r.NormalizedName == normalizedRoleName);
        queryable = queryable.WhereIf(id != null, r => r.Id != id);
        
        return await queryable.AnyAsync(cancellationToken);
    }

    public async Task<Role?> FindByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        var normalizedRoleName = name.NormalizeValue();
        
        var queryable = AsQueryable();
        queryable = queryable.Where(r => r.NormalizedName == normalizedRoleName);
        
        return await queryable.SingleOrDefaultAsync(cancellationToken);
    }
}