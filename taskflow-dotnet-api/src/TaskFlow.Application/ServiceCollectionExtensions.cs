using System.Globalization;
using System.Reflection;
using System.Text;
using TaskFlow.Application.Auth;
using TaskFlow.Application.AuthTokens;
using TaskFlow.Application.BackgroundJobs;
using TaskFlow.Application.Contracts.ActivityLogs;
using TaskFlow.Application.Contracts.Auth;
using TaskFlow.Application.Contracts.AuthTokens;
using TaskFlow.Application.Contracts.BackgroundJobs;
using TaskFlow.Application.Contracts.Categories;
using TaskFlow.Application.Contracts.CronJobs;
using TaskFlow.Application.Contracts.Email;
using TaskFlow.Application.Contracts.Permissions;
using TaskFlow.Application.Contracts.Profiles;
using TaskFlow.Application.Contracts.Roles;
using TaskFlow.Application.Contracts.Sessions;
using TaskFlow.Application.Contracts.SnapshotLogs;
using TaskFlow.Application.Contracts.Reports;
using TaskFlow.Application.Contracts.TodoComments;
using TaskFlow.Application.Contracts.TodoItems;
using TaskFlow.Application.Contracts.Users;
using TaskFlow.Application.ActivityLogs;
using TaskFlow.Application.Categories;
using TaskFlow.Application.CronJobs;
using TaskFlow.Application.Email;
using TaskFlow.Application.Permissions;
using TaskFlow.Application.Profiles;
using TaskFlow.Application.Reports;
using TaskFlow.Application.Roles;
using TaskFlow.Application.Sessions;
using TaskFlow.Application.SnapshotLogs;
using TaskFlow.Application.TodoComments;
using TaskFlow.Application.TodoItems;
using TaskFlow.Application.Users;
using TaskFlow.Domain.Repositories;
using TaskFlow.Domain.Shared.Email;
using TaskFlow.Domain.Shared.Extensions;
using TaskFlow.Domain.Shared.Localization;
using TaskFlow.Domain.Shared.Users;
using TaskFlow.Domain.Users;
using FluentValidation;
using FluentValidation.AspNetCore;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Localization;
using Microsoft.IdentityModel.Tokens;

namespace TaskFlow.Application;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationService(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<SmtpOptions>(configuration.GetSection(SmtpOptions.SectionName));

        services.AddAutoMapper(Assembly.GetExecutingAssembly());
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        var referencedAssemblies = Assembly.GetExecutingAssembly()
            .GetReferencedAssemblies()
            .Select(Assembly.Load)
            .Where(a =>
                a.GetTypes().Any(t =>
                    !t.IsAbstract &&
                    t.GetInterfaces().Any(i =>
                        i.IsGenericType &&
                        i.GetGenericTypeDefinition() == typeof(IValidator<>))))
            .Distinct()
            .ToList();

        foreach (var assembly in referencedAssemblies)
        {
            services.AddValidatorsFromAssembly(assembly);
        }
        services.AddFluentValidationAutoValidation();
        services.AddFluentValidationClientsideAdapters();

        services.AddJsonLocalization();
        services.AddIdentityConfiguration();
        services.AddHangfireServiceRegistration(configuration);
        
        services.AddScoped<IEmailAppService, EmailAppService>();
        services.AddScoped<ISnapshotLogAppService, SnapshotLogAppService>();
        services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
        services.AddScoped<ICurrentUser, CurrentUser>();
        services.AddScoped<IPasswordValidator, PasswordValidator>();
        services.AddScoped<IJwtTokenAppService, JwtTokenAppService>();
        services.AddScoped<IAuthAppService, AuthAppService>();
        services.AddScoped<IPermissionAppService, PermissionAppService>();
        services.AddScoped<IProfileAppService, ProfileAppService>();
        services.AddScoped<IRoleAppService, RoleAppService>();
        services.AddScoped<ISessionAppService, SessionAppService>();
        services.AddScoped<IUserAppService, UserAppService>();
        services.AddScoped<ICategoryAppService, CategoryAppService>();
        services.AddScoped<IActivityLogAppService, ActivityLogAppService>();
        services.AddScoped<ITodoCommentAppService, TodoCommentAppService>();
        services.AddScoped<ITodoItemAppService, TodoItemAppService>();
        services.AddScoped<IReportAppService, ReportAppService>();
        
        services.AddHostedService<ApplicationSeedInitializer>();

        return services;
    }

    private static void AddJsonLocalization(this IServiceCollection services)
    {
        var resourcesPath = Path.Combine(Directory.GetCurrentDirectory(), "Resources", "Localization");
        services.AddSingleton<IStringLocalizerFactory>(new JsonStringLocalizerFactory(resourcesPath, LocalizationConsts.English));
        services.AddLocalization();
        services.Configure<RequestLocalizationOptions>(options =>
        {
            var supportedCultures = new List<CultureInfo>
            {
                new(LocalizationConsts.English),
                new(LocalizationConsts.Turkish)
            };

            options.DefaultRequestCulture = new RequestCulture(LocalizationConsts.English);
            options.SupportedCultures = supportedCultures;
            options.SupportedUICultures = supportedCultures;

            options.RequestCultureProviders = new List<IRequestCultureProvider>
            {
                new AcceptLanguageHeaderRequestCultureProvider(),
                new QueryStringRequestCultureProvider()
            };
        });
    }
    
    private static void AddIdentityConfiguration(this IServiceCollection services)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtConsts.SigningKey)),
                    ValidIssuer = JwtConsts.Issuer,
                    ValidAudience = JwtConsts.Audience,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
                
                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = async context =>
                    {
                        var claimsPrincipal = context.Principal;
                        var userId = claimsPrincipal?.GetUserId();
                        var sessionId = claimsPrincipal?.FindFirst(CustomClaimTypes.SessionId)?.Value;

                        if (userId == null || userId == Guid.Empty)
                        {
                            context.Fail("User ID could not be validated.");
                            return;
                        }

                        if (sessionId == null || sessionId == Guid.Empty.ToString())
                        {
                            context.Fail("Session ID could not be validated.");
                            return;
                        }
                        
                        var parsedSessionId = Guid.Parse(sessionId);

                        var serviceProvider = context.HttpContext.RequestServices;
                        var sessionRepository = serviceProvider.GetRequiredService<ISessionRepository>();
                        
                        var matchedUserSession = await sessionRepository.FirstOrDefaultAsync(s =>
                            s.UserId == userId &&
                            s.Id == parsedSessionId &&
                            !s.IsRevoked
                        );
                        
                        if (matchedUserSession == null)
                        {
                            context.Fail("User session is not valid.");
                        }

                        // TODO: Opsional: Validate additional session parameters such as IP address or User-Agent
                        // if (matchedUserSession.ClientIp != context.HttpContext.GetClientIpAddress())
                        // {
                        //     context.Fail("Client IP address does not match.");
                        //     return;
                        // }
                        //
                        // matchedUserSession.LastActivityTime = DateTime.UtcNow;
                        // await userSessionRepository.UpdateAsync(matchedUserSession, true);
                    }
                };
            });
    }

    private static void AddHangfireServiceRegistration(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHangfire(options =>
        {
            options.SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UsePostgreSqlStorage(conf =>
                {
                    conf.UseNpgsqlConnection(configuration.GetConnectionString("Default"));
                });
        });
        services.AddHangfireServer(options =>
        {
            options.Queues = ["critical", "reports", "maintenance", "default"];
            options.WorkerCount = 5;
        });

        services.AddScoped<IBackgroundJobExecutor, HangfireJobExecutor>();
        services.AddScoped<IHangfireJobSeederContributor, HangfireJobSeederContributor>();

        //services.AddScoped<IHangfireJobModule, ExampleCronJob>();

        var jobTypes = Assembly.GetExecutingAssembly()
            .GetTypes()
            .Where(
                t =>
                    t.IsClass &&
                    !t.IsAbstract &&
                    t.GetInterfaces()
                        .Any(i =>
                            i.IsGenericType &&
                            i.GetGenericTypeDefinition() == typeof(IBackgroundJob<>)
                        )
            );

        foreach (var jobType in jobTypes)
        {
            services.AddScoped(jobType);
        }
    }

}