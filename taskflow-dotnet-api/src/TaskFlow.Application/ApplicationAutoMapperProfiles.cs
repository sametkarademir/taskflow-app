using AutoMapper;
using TaskFlow.Application.Contracts.ActivityLogs;
using TaskFlow.Application.Contracts.Categories;
using TaskFlow.Application.Contracts.Permissions;
using TaskFlow.Application.Contracts.Profiles;
using TaskFlow.Application.Contracts.Roles;
using TaskFlow.Application.Contracts.Sessions;
using TaskFlow.Application.Contracts.TodoComments;
using TaskFlow.Application.Contracts.TodoItems;
using TaskFlow.Application.Contracts.Users;
using TaskFlow.Domain.ActivityLogs;
using TaskFlow.Domain.Categories;
using TaskFlow.Domain.Permissions;
using TaskFlow.Domain.Roles;
using TaskFlow.Domain.Sessions;
using TaskFlow.Domain.TodoComments;
using TaskFlow.Domain.TodoItems;
using TaskFlow.Domain.Users;

namespace TaskFlow.Application;

public class ApplicationAutoMapperProfiles : Profile
{
    public ApplicationAutoMapperProfiles()
    {
        CreateMap<Permission, PermissionResponseDto>();
        
        CreateMap<Role, RoleResponseDto>();
        CreateMap<Role, CreateRoleRequestDto>();
        CreateMap<Role, UpdateRoleRequestDto>();
        
        CreateMap<Session, SessionResponseDto>();
        
        CreateMap<User, ProfileResponseDto>();
        CreateMap<User, UserResponseDto>();
        CreateMap<User, CreateUserRequestDto>();
        CreateMap<User, UpdateUserRequestDto>();
        
        CreateMap<Category, CategoryResponseDto>();
        
        CreateMap<ActivityLog, ActivityLogResponseDto>();
        
        CreateMap<TodoComment, TodoCommentResponseDto>();
        
        CreateMap<TodoItem, TodoItemResponseDto>();
    }
}