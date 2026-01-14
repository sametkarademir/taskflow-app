using TaskFlow.Domain;
using TaskFlow.Domain.Roles;
using TaskFlow.Domain.Shared.Roles;
using TaskFlow.EntityFrameworkCore.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace TaskFlow.EntityFrameworkCore.EntityConfigurations;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ApplyGlobalEntityConfigurations();
        
        builder.ToTable(ApplicationConsts.DbTablePrefix + "Roles", ApplicationConsts.DbSchema);
        builder.HasIndex(item => item.NormalizedName)
            .IsUnique()
            .HasFilter($"\"{nameof(Role.IsDeleted)}\" = FALSE");
        
        builder.Property(item => item.Name).HasMaxLength(RoleConsts.NameMaxLength).IsRequired();
        builder.Property(item => item.NormalizedName).HasMaxLength(RoleConsts.NameMaxLength).IsRequired();
        builder.Property(item => item.Description).HasMaxLength(RoleConsts.DescriptionMaxLength).IsRequired(false);
        
    }
}