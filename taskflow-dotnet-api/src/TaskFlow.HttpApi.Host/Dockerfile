FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/TaskFlow.HttpApi.Host/TaskFlow.HttpApi.Host.csproj", "src/TaskFlow.HttpApi.Host/"]
COPY ["src/TaskFlow.Application.Contracts/TaskFlow.Application.Contracts.csproj", "src/TaskFlow.Application.Contracts/"]
COPY ["src/TaskFlow.Domain.Shared/TaskFlow.Domain.Shared.csproj", "src/TaskFlow.Domain.Shared/"]
COPY ["src/TaskFlow.Application/TaskFlow.Application.csproj", "src/TaskFlow.Application/"]
COPY ["src/TaskFlow.Domain/TaskFlow.Domain.csproj", "src/TaskFlow.Domain/"]
COPY ["src/TaskFlow.EntityFrameworkCore/TaskFlow.EntityFrameworkCore.csproj", "src/TaskFlow.EntityFrameworkCore/"]
COPY ["src/TaskFlow.HttpApi.Client/TaskFlow.HttpApi.Client.csproj", "src/TaskFlow.HttpApi.Client/"]
COPY ["src/TaskFlow.HttpApi/TaskFlow.HttpApi.csproj", "src/TaskFlow.HttpApi/"]
RUN dotnet restore "src/TaskFlow.HttpApi.Host/TaskFlow.HttpApi.Host.csproj"
COPY . .
WORKDIR "/src/src/TaskFlow.HttpApi.Host"
RUN dotnet build "TaskFlow.HttpApi.Host.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "TaskFlow.HttpApi.Host.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TaskFlow.HttpApi.Host.dll"]
