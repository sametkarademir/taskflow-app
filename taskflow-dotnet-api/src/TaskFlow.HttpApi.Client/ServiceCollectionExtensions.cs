using Microsoft.Extensions.DependencyInjection;

namespace TaskFlow.HttpApi.Client;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddHttpApiClientExtensions(this IServiceCollection services)
    {

        return services;
    }
}