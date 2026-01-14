using TaskFlow.Domain;
using TaskFlow.Domain.Shared.SnapshotAppSettings;
using TaskFlow.Domain.SnapshotAppSettings;
using TaskFlow.EntityFrameworkCore.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace TaskFlow.EntityFrameworkCore.EntityConfigurations;

public class SnapshotAppSettingConfiguration : IEntityTypeConfiguration<SnapshotAppSetting>
{
    public void Configure(EntityTypeBuilder<SnapshotAppSetting> builder)
    {
        builder.ApplyGlobalEntityConfigurations();

        builder.ToTable(ApplicationConsts.DbTablePrefix + "SnapshotAppSettings", ApplicationConsts.DbSchema);
        builder.HasIndex(item => item.Key);
        builder.HasIndex(item => item.Value);

        builder.Property(item => item.Key).HasMaxLength(SnapshotAppSettingConsts.KeyMaxLength).IsRequired();
        builder.Property(item => item.Value).HasMaxLength(SnapshotAppSettingConsts.ValueMaxLength).IsRequired();

        builder.HasOne(item => item.SnapshotLog)
            .WithMany(item => item.SnapshotAppSettings)
            .HasForeignKey(item => item.SnapshotLogId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}