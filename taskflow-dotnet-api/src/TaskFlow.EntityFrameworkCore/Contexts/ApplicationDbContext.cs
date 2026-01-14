using System.Reflection;
using TaskFlow.Domain.ActivityLogs;
using TaskFlow.Domain.AuditLogs;
using TaskFlow.Domain.Categories;
using TaskFlow.Domain.ConfirmationCodes;
using TaskFlow.Domain.EntityPropertyChanges;
using TaskFlow.Domain.HttpRequestLogs;
using TaskFlow.Domain.Permissions;
using TaskFlow.Domain.RefreshTokens;
using TaskFlow.Domain.RolePermissions;
using TaskFlow.Domain.Roles;
using TaskFlow.Domain.Sessions;
using TaskFlow.Domain.SnapshotAppSettings;
using TaskFlow.Domain.SnapshotAssemblies;
using TaskFlow.Domain.SnapshotLogs;
using TaskFlow.Domain.TodoComments;
using TaskFlow.Domain.TodoItems;
using TaskFlow.Domain.UserRoles;
using TaskFlow.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace TaskFlow.EntityFrameworkCore.Contexts;

public class ApplicationDbContext : DbContext
{
    public DbSet<ActivityLog> ActivityLogs { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<EntityPropertyChange> EntityPropertyChanges { get; set; }
    public DbSet<HttpRequestLog> HttpRequestLogs { get; set; }
    public DbSet<SnapshotLog> SnapshotLogs { get; set; }
    public DbSet<SnapshotAssembly> SnapshotAssemblies { get; set; }
    public DbSet<SnapshotAppSetting> SnapshotAppSettings { get; set; }
    public DbSet<ConfirmationCode> ConfirmationCodes { get; set; }
    public DbSet<Permission> Permissions { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<RolePermission> RolePermissions { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Session> Sessions { get; set; }
    public DbSet<TodoComment> TodoComments { get; set; }
    public DbSet<TodoItem> TodoItems { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<User> Users { get; set; }
    
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}