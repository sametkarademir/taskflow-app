using TaskFlow.Domain.Permissions;
using TaskFlow.Domain.Repositories;
using TaskFlow.Domain.RolePermissions;
using TaskFlow.Domain.Roles;
using TaskFlow.Domain.Shared.Extensions;
using TaskFlow.Domain.Shared.Permissions;
using TaskFlow.Domain.Shared.Repositories;
using TaskFlow.Domain.Shared.Roles;
using TaskFlow.Domain.UserRoles;
using TaskFlow.Domain.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace TaskFlow.Domain;

public class DevelopmentDataSeederContributor(
    IUserRepository userRepository,
    IRoleRepository roleRepository,
    IUserRoleRepository userRoleRepository,
    IPermissionRepository permissionRepository,
    IRolePermissionRepository rolePermissionRepository,
    IUnitOfWork unitOfWork,
    IPasswordHasher<User> passwordHasher,
    ILogger<DevelopmentDataSeederContributor> logger)
{
    public async Task SeedAsync()
    {
        try
        {
            logger.LogInformation("Starting seeding...");

            // Add your seeding logic here
            await CreateAllPermissionsAsync();
            await CreateAdminUserAsync();
            await CreateMemberRoleAsync();

            logger.LogInformation("Seeding completed.");
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error occurred during seeding");
        }
    }

    private async Task CreateAllPermissionsAsync()
    {
        var permissionCount = await permissionRepository.CountAsync();
        if (permissionCount > 0)
        {
            return;
        }

        var permissions = GetAllPermissionsFromConsts();
        await permissionRepository.AddRangeAsync(permissions);
        await unitOfWork.SaveChangesAsync();
    }

    private List<Permission> GetAllPermissionsFromConsts()
    {
        var permissions = new List<Permission>();
        var permissionConstType = typeof(PermissionConsts);

        var nestedTypes = permissionConstType.GetNestedTypes();

        foreach (var nestedType in nestedTypes)
        {
            var fields = nestedType.GetFields(
                System.Reflection.BindingFlags.Public |
                System.Reflection.BindingFlags.Static);

            foreach (var field in fields)
            {
                if (field.FieldType == typeof(string))
                {
                    var value = (string)field.GetValue(null)!;
                    permissions.Add(new Permission
                    {
                        Name = value,
                        NormalizedName = value.NormalizeValue()
                    });
                }
            }
        }

        return permissions;
    }

    private async Task CreateAdminUserAsync()
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync();
        try
        {
            var normalizedAdminRoleName = RoleConsts.Admin.NormalizeValue();

            const string email = "admin@taskflow.com";
            var normalizedEmail = email.NormalizeValue();

            var matchedAdminUser = await userRepository.SingleOrDefaultAsync(
                predicate: u => u.Email == email,
                enableTracking: false
            );

            if (matchedAdminUser != null)
            {
                return;
            }

            var existingAdminRole = await roleRepository.SingleOrDefaultAsync(
                predicate: r => r.NormalizedName == normalizedAdminRoleName,
                enableTracking: false
            );
            if (existingAdminRole == null)
            {
                existingAdminRole = new Role
                {
                    Id = Guid.NewGuid(),
                    Name = RoleConsts.Admin,
                    NormalizedName = normalizedAdminRoleName
                };
                await roleRepository.AddAsync(existingAdminRole);
            }

            var allPermissions = await permissionRepository.GetAllAsync(enableTracking: false);
            var newRolePermissions = allPermissions.Select(p => new RolePermission
            {
                RoleId = existingAdminRole.Id,
                PermissionId = p.Id
            }).ToList();

            await rolePermissionRepository.AddRangeAsync(newRolePermissions);

            var newUser = new User
            {
                Id = Guid.NewGuid(),
                Email = email,
                NormalizedEmail = normalizedEmail,
                EmailConfirmed = true,
                PhoneNumber = null,
                PhoneNumberConfirmed = true,
                TwoFactorEnabled = false,
                LockoutEnd = null,
                LockoutEnabled = false,
                AccessFailedCount = 0,
                FirstName = "Admin",
                LastName = "User",
                PasswordChangedTime = null,
                IsActive = true
            };
            newUser.PasswordHash = passwordHasher.HashPassword(newUser, "Pp123456*");
            await userRepository.AddAsync(newUser);

            var newUserRole = new UserRole
            {
                RoleId = existingAdminRole.Id,
                UserId = newUser.Id
            };
            await userRoleRepository.AddAsync(newUserRole);

            await transaction.CommitAsync();
            await unitOfWork.SaveChangesAsync();
        }
        catch (Exception e)
        {
            await transaction.RollbackAsync();
            logger.LogError(e, "Error occurred while creating admin user");

            throw;
        }
    }

    private async Task CreateMemberRoleAsync()
    {
        await using var transaction = await unitOfWork.BeginTransactionAsync();
        try
        {
            var normalizedMemberRoleName = RoleConsts.Member.NormalizeValue();

            var existingMemberRole = await roleRepository.SingleOrDefaultAsync(
                predicate: r => r.NormalizedName == normalizedMemberRoleName,
                enableTracking: false
            );
            
            if (existingMemberRole != null)
            {
                return;
            }

            existingMemberRole = new Role
            {
                Id = Guid.NewGuid(),
                Name = RoleConsts.Member,
                NormalizedName = normalizedMemberRoleName
            };
            await roleRepository.AddAsync(existingMemberRole);

            var allMatchedPermissions = await permissionRepository.GetAllAsync(
                predicate: 
                    p => p.Name.StartsWith("Category.") || 
                    p.Name.StartsWith("ActivityLog.") || 
                    p.Name.StartsWith("TodoComment.") || 
                    p.Name.StartsWith("TodoItem."),
                enableTracking: false);

            var newRolePermissions = allMatchedPermissions.Select(p => new RolePermission
            {
                RoleId = existingMemberRole.Id,
                PermissionId = p.Id
            }).ToList();

            await rolePermissionRepository.AddRangeAsync(newRolePermissions);

            await transaction.CommitAsync();
            await unitOfWork.SaveChangesAsync();
            
            logger.LogInformation("Member role created successfully with {Count} permissions.", allMatchedPermissions.Count);
        }
        catch (Exception e)
        {
            await transaction.RollbackAsync();
            logger.LogError(e, "Error occurred while creating member role");

            throw;
        }
    }
}