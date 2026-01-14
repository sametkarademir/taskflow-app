# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["TaskFlow.sln", "./"]
COPY ["src/TaskFlow.Domain.Shared/TaskFlow.Domain.Shared.csproj", "src/TaskFlow.Domain.Shared/"]
COPY ["src/TaskFlow.Domain/TaskFlow.Domain.csproj", "src/TaskFlow.Domain/"]
COPY ["src/TaskFlow.EntityFrameworkCore/TaskFlow.EntityFrameworkCore.csproj", "src/TaskFlow.EntityFrameworkCore/"]
COPY ["src/TaskFlow.Application.Contracts/TaskFlow.Application.Contracts.csproj", "src/TaskFlow.Application.Contracts/"]
COPY ["src/TaskFlow.Application/TaskFlow.Application.csproj", "src/TaskFlow.Application/"]
COPY ["src/TaskFlow.HttpApi/TaskFlow.HttpApi.csproj", "src/TaskFlow.HttpApi/"]
COPY ["src/TaskFlow.HttpApi.Client/TaskFlow.HttpApi.Client.csproj", "src/TaskFlow.HttpApi.Client/"]
COPY ["src/TaskFlow.HttpApi.Host/TaskFlow.HttpApi.Host.csproj", "src/TaskFlow.HttpApi.Host/"]

# Restore dependencies
RUN dotnet restore "TaskFlow.sln"

# Copy all source files
COPY . .

# Build the application
WORKDIR "/src/src/TaskFlow.HttpApi.Host"
RUN dotnet build "TaskFlow.HttpApi.Host.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "TaskFlow.HttpApi.Host.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Create a non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy published files
COPY --from=publish /app/publish .

# Change ownership
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Entry point
ENTRYPOINT ["dotnet", "TaskFlow.HttpApi.Host.dll"]
