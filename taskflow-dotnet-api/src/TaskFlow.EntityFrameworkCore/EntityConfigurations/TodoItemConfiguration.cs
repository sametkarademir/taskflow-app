using TaskFlow.Domain;
using TaskFlow.Domain.Shared.TodoItems;
using TaskFlow.Domain.TodoItems;
using TaskFlow.EntityFrameworkCore.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace TaskFlow.EntityFrameworkCore.EntityConfigurations;

public class TodoItemConfiguration : IEntityTypeConfiguration<TodoItem>
{
    public void Configure(EntityTypeBuilder<TodoItem> builder)
    {
        builder.ApplyGlobalEntityConfigurations();
        
        builder.ToTable(ApplicationConsts.DbTablePrefix + "TodoItems", ApplicationConsts.DbSchema);
        
        builder.Property(item => item.Title).HasMaxLength(TodoItemConsts.TitleMaxLength).IsRequired();
        builder.Property(item => item.Description).HasMaxLength(TodoItemConsts.DescriptionMaxLength).IsRequired(false);
        builder.Property(item => item.Status).IsRequired();
        builder.Property(item => item.Priority).IsRequired();
        builder.Property(item => item.DueDate).IsRequired(false);
        builder.Property(item => item.IsArchived).HasDefaultValue(false).IsRequired();
        builder.Property(item => item.ArchivedTime).IsRequired(false);
        
        builder.HasOne(item => item.Category)
            .WithMany(item => item.TodoItems)
            .HasForeignKey(item => item.CategoryId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(item => item.User)
            .WithMany(item => item.TodoItems)
            .HasForeignKey(item => item.UserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
    }
}

