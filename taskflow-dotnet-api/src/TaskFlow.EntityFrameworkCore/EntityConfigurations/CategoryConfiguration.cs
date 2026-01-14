using TaskFlow.Domain;
using TaskFlow.Domain.Categories;
using TaskFlow.Domain.Shared.Categories;
using TaskFlow.EntityFrameworkCore.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace TaskFlow.EntityFrameworkCore.EntityConfigurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ApplyGlobalEntityConfigurations();
        
        builder.ToTable(ApplicationConsts.DbTablePrefix + "Categories", ApplicationConsts.DbSchema);
        
        builder.Property(item => item.Name).HasMaxLength(CategoryConsts.NameMaxLength).IsRequired();
        builder.Property(item => item.Description).HasMaxLength(CategoryConsts.DescriptionMaxLength).IsRequired(false);
        builder.Property(item => item.ColorHex).HasMaxLength(CategoryConsts.ColorHexMaxLength).IsRequired(false);
        
        builder.HasOne(item => item.User)
            .WithMany(item => item.Categories)
            .HasForeignKey(item => item.UserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
    }
}

