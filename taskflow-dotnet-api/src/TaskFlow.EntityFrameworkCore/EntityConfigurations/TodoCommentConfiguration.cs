using TaskFlow.Domain;
using TaskFlow.Domain.Shared.TodoComments;
using TaskFlow.Domain.TodoComments;
using TaskFlow.EntityFrameworkCore.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace TaskFlow.EntityFrameworkCore.EntityConfigurations;

public class TodoCommentConfiguration : IEntityTypeConfiguration<TodoComment>
{
    public void Configure(EntityTypeBuilder<TodoComment> builder)
    {
        builder.ApplyGlobalEntityConfigurations();
        
        builder.ToTable(ApplicationConsts.DbTablePrefix + "TodoComments", ApplicationConsts.DbSchema);
        
        builder.Property(item => item.Content).HasMaxLength(TodoCommentConsts.ContentMaxLength).IsRequired();
        
        builder.HasOne(item => item.TodoItem)
            .WithMany(item => item.Comments)
            .HasForeignKey(item => item.TodoItemId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(item => item.User)
            .WithMany(item => item.TodoComments)
            .HasForeignKey(item => item.UserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
    }
}

