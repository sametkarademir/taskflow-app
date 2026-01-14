using TaskFlow.Domain;
using TaskFlow.Domain.Repositories;
using TaskFlow.Domain.Shared.AuditLogs;
using TaskFlow.Domain.Shared.Repositories;
using TaskFlow.EntityFrameworkCore.AuditLogs;
using TaskFlow.EntityFrameworkCore.Contexts;
using TaskFlow.EntityFrameworkCore.Extensions;
using TaskFlow.EntityFrameworkCore.Repositories;
using TaskFlow.EntityFrameworkCore.Repositories.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

namespace TaskFlow.EntityFrameworkCore;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddEntityFrameworkCoreService(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<NpgsqlDataSource>(opt =>
        {
            var dataSourceBuilder = new NpgsqlDataSourceBuilder(configuration.GetConnectionString("Default"));
            dataSourceBuilder.EnableDynamicJson();
            var dataSource = dataSourceBuilder.Build();
            
            return dataSource;
        });

        services.AddDbContext<ApplicationDbContext>((serviceProvider, opt) =>
        {
            var dataSource = serviceProvider.GetRequiredService<NpgsqlDataSource>();
            opt.UseNpgsql(dataSource, builder =>
            {
                builder.CommandTimeout(30);
            });
            opt.UseEntityMetadataTracking();
            opt.UseAuditLog();
        });

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IActivityLogRepository, ActivityLogRepository>();
        services.AddScoped<IAuditLogRepository, AuditLogRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<IEntityPropertyChangeRepository, EntityPropertyChangeRepository>();
        services.AddScoped<IHttpRequestLogRepository, HttpRequestLogRepository>();
        services.AddScoped<ISnapshotLogRepository, SnapshotLogRepository>();
        services.AddScoped<ISnapshotAssemblyRepository, SnapshotAssemblyRepository>();
        services.AddScoped<ISnapshotAppSettingRepository, SnapshotAppSettingRepository>();
        services.AddScoped<IConfirmationCodeRepository, ConfirmationCodeRepository>();
        services.AddScoped<IPermissionRepository, PermissionRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IRolePermissionRepository, RolePermissionRepository>();
        services.AddScoped<ISessionRepository, SessionRepository>();
        services.AddScoped<ITodoCommentRepository, TodoCommentRepository>();
        services.AddScoped<ITodoItemRepository, TodoItemRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUserRoleRepository, UserRoleRepository>();

        services.AddScoped<DevelopmentDataSeederContributor>();
        services.AddHostedService<DbMigrationInitializer>();

        return services;
    }
}