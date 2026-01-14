using TaskFlow.Domain;
using TaskFlow.Domain.Permissions;
using TaskFlow.Domain.Shared.Permissions;
using TaskFlow.EntityFrameworkCore.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace TaskFlow.EntityFrameworkCore.EntityConfigurations;

public class PermissionConfiguration : IEntityTypeConfiguration<Permission>
{
    public void Configure(EntityTypeBuilder<Permission> builder)
    {
        builder.ApplyGlobalEntityConfigurations();

        builder.ToTable(ApplicationConsts.DbTablePrefix + "Permissions", ApplicationConsts.DbSchema);
        builder.HasIndex(item => item.NormalizedName)
            .IsUnique()
            .HasFilter($"\"{nameof(Permission.IsDeleted)}\" = FALSE");

        builder.Property(item => item.Name).HasMaxLength(PermissionConsts.NameMaxLength).IsRequired();
        builder.Property(item => item.NormalizedName).HasMaxLength(PermissionConsts.NameMaxLength).IsRequired();
    }
}