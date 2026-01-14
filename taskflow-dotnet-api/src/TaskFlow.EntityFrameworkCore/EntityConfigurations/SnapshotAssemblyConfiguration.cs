using TaskFlow.Domain;
using TaskFlow.Domain.Shared.SnapshotAssemblies;
using TaskFlow.Domain.SnapshotAssemblies;
using TaskFlow.EntityFrameworkCore.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace TaskFlow.EntityFrameworkCore.EntityConfigurations;

public class SnapshotAssemblyConfiguration : IEntityTypeConfiguration<SnapshotAssembly>
{
    public void Configure(EntityTypeBuilder<SnapshotAssembly> builder)
    {
        builder.ApplyGlobalEntityConfigurations();

        builder.ToTable(ApplicationConsts.DbTablePrefix + "SnapshotAssemblies", ApplicationConsts.DbSchema);
        builder.HasIndex(item => item.Name);

        builder.Property(item => item.Name).HasMaxLength(SnapshotAssemblyConsts.NameMaxLength).IsRequired(false);
        builder.Property(item => item.Version).HasMaxLength(SnapshotAssemblyConsts.VersionMaxLength).IsRequired(false);
        builder.Property(item => item.Culture).HasMaxLength(SnapshotAssemblyConsts.CultureMaxLength).IsRequired(false);
        builder.Property(item => item.PublicKeyToken).HasMaxLength(SnapshotAssemblyConsts.PublicKeyTokenMaxLength).IsRequired(false);
        builder.Property(item => item.Location).HasMaxLength(SnapshotAssemblyConsts.LocationMaxLength).IsRequired(false);

        builder.HasOne(item => item.SnapshotLog)
            .WithMany(item => item.SnapshotAssemblies)
            .HasForeignKey(item => item.SnapshotLogId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}