using TaskFlow.Domain;
using TaskFlow.Domain.RolePermissions;
using TaskFlow.EntityFrameworkCore.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace TaskFlow.EntityFrameworkCore.EntityConfigurations;

public class RolePermissionConfiguration : IEntityTypeConfiguration<RolePermission>
{
    public void Configure(EntityTypeBuilder<RolePermission> builder)
    {
        builder.ApplyGlobalEntityConfigurations();
        builder.ToTable(ApplicationConsts.DbTablePrefix + "RolePermissions", ApplicationConsts.DbSchema);
        builder.HasIndex(item => new {item.RoleId, item.PermissionId})
            .IsUnique()
            .HasFilter($"\"{nameof(RolePermission.IsDeleted)}\" = FALSE");
        
        builder.HasOne(item => item.Permission)
            .WithMany(item => item.RolePermissions)
            .HasForeignKey(item => item.PermissionId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(item => item.Role)
            .WithMany(item => item.RolePermissions)
            .HasForeignKey(item => item.RoleId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
    }
}