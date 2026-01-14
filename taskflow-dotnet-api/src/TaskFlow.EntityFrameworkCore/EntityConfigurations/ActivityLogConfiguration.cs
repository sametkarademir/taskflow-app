using TaskFlow.Domain;
using TaskFlow.Domain.ActivityLogs;
using TaskFlow.Domain.Shared.ActivityLogs;
using TaskFlow.EntityFrameworkCore.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace TaskFlow.EntityFrameworkCore.EntityConfigurations;

public class ActivityLogConfiguration : IEntityTypeConfiguration<ActivityLog>
{
    public void Configure(EntityTypeBuilder<ActivityLog> builder)
    {
        builder.ApplyGlobalEntityConfigurations();
        
        builder.ToTable(ApplicationConsts.DbTablePrefix + "ActivityLogs", ApplicationConsts.DbSchema);
        
        builder.Property(item => item.ActionKey).HasMaxLength(ActivityLogConsts.ActionKeyMaxLength).IsRequired();
        builder.Property(item => item.OldValue).HasMaxLength(ActivityLogConsts.OldValueMaxLength).IsRequired(false);
        builder.Property(item => item.NewValue).HasMaxLength(ActivityLogConsts.NewValueMaxLength).IsRequired(false);
        
        builder.HasOne(item => item.TodoItem)
            .WithMany(item => item.Activities)
            .HasForeignKey(item => item.TodoItemId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(item => item.User)
            .WithMany(item => item.ActivityLogs)
            .HasForeignKey(item => item.UserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
    }
}

