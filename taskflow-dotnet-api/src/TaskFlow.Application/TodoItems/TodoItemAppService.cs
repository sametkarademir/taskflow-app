using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.Contracts.Common.Results;
using TaskFlow.Application.Contracts.TodoItems;
using TaskFlow.Application.Contracts.Users;
using TaskFlow.Domain.ActivityLogs;
using TaskFlow.Domain.Categories;
using TaskFlow.Domain.Repositories;
using TaskFlow.Domain.Shared.BaseEntities.Abstractions;
using TaskFlow.Domain.Shared.Exceptions.Types;
using TaskFlow.Domain.Shared.Extensions;
using TaskFlow.Domain.Shared.Localization;
using TaskFlow.Domain.Shared.Repositories;
using TaskFlow.Domain.Shared.TodoItems;
using TaskFlow.Domain.TodoItems;
using Microsoft.Extensions.Localization;

namespace TaskFlow.Application.TodoItems;

public class TodoItemAppService : ITodoItemAppService
{
    private readonly ITodoItemRepository _todoItemRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IActivityLogRepository _activityLogRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUser _currentUser;
    private readonly IStringLocalizer<ApplicationResource> _localizer;

    public TodoItemAppService(
        ITodoItemRepository todoItemRepository,
        ICategoryRepository categoryRepository,
        IActivityLogRepository activityLogRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUser currentUser,
        IStringLocalizer<ApplicationResource> localizer)
    {
        _todoItemRepository = todoItemRepository;
        _categoryRepository = categoryRepository;
        _activityLogRepository = activityLogRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUser = currentUser;
        _localizer = localizer;

        if (!_currentUser.IsAuthenticated || _currentUser.Id == null)
        {
            throw new AppUnauthorizedException();
        }
    }

    public async Task<TodoItemResponseDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var matchedTodoItem = await _todoItemRepository.GetAsync(
            predicate: ti => ti.Id == id && ti.UserId == _currentUser.Id,
            enableTracking: false,
            cancellationToken: cancellationToken
        );

        return _mapper.Map<TodoItemResponseDto>(matchedTodoItem);
    }

    public async Task<List<TodoItemColumnDto>> GetListAsync(GetListTodoItemsRequestDto? request = null, CancellationToken cancellationToken = default)
    {
        var queryable = _todoItemRepository.AsQueryable();
        
        queryable = queryable.Where(ti => ti.UserId == _currentUser.Id && !ti.IsArchived);
        queryable = queryable.WhereIf(request?.Status.HasValue == true, ti => ti.Status == request!.Status!.Value);
        queryable = queryable.WhereIf(request?.Priority.HasValue == true, ti => ti.Priority == request!.Priority!.Value);
        queryable = queryable.WhereIf(request?.CategoryId.HasValue == true, ti => ti.CategoryId == request!.CategoryId!.Value);
        
        queryable = queryable.Include(ti => ti.Category);
        queryable = queryable.AsNoTracking();
        
        var todoItems = await queryable.ToListAsync(cancellationToken);

        var mappedTodoItems = _mapper.Map<List<TodoItemResponseDto>>(todoItems);

        var backlogItems = mappedTodoItems.Where(ti => ti.Status == TodoStatus.Backlog).ToList();
        var inProgressItems = mappedTodoItems.Where(ti => ti.Status == TodoStatus.InProgress).ToList();
        var blockedItems = mappedTodoItems.Where(ti => ti.Status == TodoStatus.Blocked).ToList();
        var completedItems = mappedTodoItems.Where(ti => ti.Status == TodoStatus.Completed).ToList();

        var columns = new List<TodoItemColumnDto>
        {
            new()
            {
                Title = "Backlog",
                TaskCount = backlogItems.Count,
                Items = backlogItems
            },
            new()
            {
                Title = "In Progress",
                TaskCount = inProgressItems.Count,
                Items = inProgressItems
            },
            new()
            {
                Title = "Blocked",
                TaskCount = blockedItems.Count,
                Items = blockedItems
            },
            new()
            {
                Title = "Completed",
                TaskCount = completedItems.Count,
                Items = completedItems
            }
        };

        return columns;
    }

    public async Task<PagedResult<TodoItemResponseDto>> GetPagedAndFilterAsync(GetPagedAndFilterTodoItemsRequestDto request, CancellationToken cancellationToken = default)
    {
        var queryable = _todoItemRepository.AsQueryable();
        
        queryable = queryable.Include(ti => ti.Category);

        queryable = queryable.Where(ti => ti.UserId == _currentUser.Id);
        queryable = queryable.WhereIf(request.IsArchived.HasValue, ti => ti.IsArchived == request.IsArchived!.Value);
        queryable = queryable.WhereIf(request.Status.HasValue, ti => ti.Status == request.Status!.Value);
        queryable = queryable.WhereIf(request.Priority.HasValue, ti => ti.Priority == request.Priority!.Value);
        queryable = queryable.WhereIf(request.CategoryId.HasValue, ti => ti.CategoryId == request.CategoryId!.Value);
        queryable = queryable.WhereIf(!string.IsNullOrWhiteSpace(request.Search), ti => ti.Title.Contains(request.Search!));
        
        queryable = queryable.AsNoTracking();
        queryable = queryable.ApplySort(request.GetSortRequest(nameof(CreationAuditedEntity<Guid>.CreationTime)));
        
        var pagedTodoItems = await queryable.ToPageableAsync(request.Page, request.PerPage, cancellationToken);

        var mappedTodoItems = _mapper.Map<List<TodoItemResponseDto>>(pagedTodoItems.Data);

        return new PagedResult<TodoItemResponseDto>(mappedTodoItems, pagedTodoItems.TotalCount, pagedTodoItems.Page, pagedTodoItems.PerPage);
    }

    public async Task<TodoItemResponseDto> CreateAsync(CreateTodoItemRequestDto request, CancellationToken cancellationToken = default)
    {
        var matchedCategory = await _categoryRepository.GetAsync(
            predicate: c => c.Id == request.CategoryId && c.UserId == _currentUser.Id,
            enableTracking: false,
            cancellationToken: cancellationToken
        );

        var newTodoItem = new TodoItem
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            Status = request.Status,
            Priority = request.Priority,
            DueDate = request.DueDate,
            CategoryId = request.CategoryId,
            UserId = _currentUser.Id!.Value
        };

        newTodoItem = await _todoItemRepository.AddAsync(newTodoItem, cancellationToken);

        var activityLog = new ActivityLog
        {
            TodoItemId = newTodoItem.Id,
            ActionKey = "LOG_TODO_ITEM_CREATED",
            NewValue = newTodoItem.Status.ToString(),
            UserId = _currentUser.Id.Value
        };

        await _activityLogRepository.AddAsync(activityLog, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<TodoItemResponseDto>(newTodoItem);
    }

    public async Task<TodoItemResponseDto> UpdateAsync(Guid id, UpdateTodoItemRequestDto request, CancellationToken cancellationToken = default)
    {
        var matchedTodoItem = await _todoItemRepository.GetAsync(
            predicate: ti => ti.Id == id && ti.UserId == _currentUser.Id,
            enableTracking: true,
            cancellationToken: cancellationToken
        );

        var matchedCategory = await _categoryRepository.GetAsync(
            predicate: c => c.Id == request.CategoryId && c.UserId == _currentUser.Id,
            enableTracking: false,
            cancellationToken: cancellationToken
        );

        var activityLogs = new List<ActivityLog>();

        if (matchedTodoItem.Title != request.Title)
        {
            activityLogs.Add(new ActivityLog
            {
                TodoItemId = matchedTodoItem.Id,
                ActionKey = "LOG_TITLE_CHANGED",
                OldValue = matchedTodoItem.Title,
                NewValue = request.Title,
                UserId = _currentUser.Id!.Value
            });
            matchedTodoItem.Title = request.Title;
        }

        if (matchedTodoItem.Description != request.Description)
        {
            activityLogs.Add(new ActivityLog
            {
                TodoItemId = matchedTodoItem.Id,
                ActionKey = "LOG_DESCRIPTION_CHANGED",
                OldValue = matchedTodoItem.Description,
                NewValue = request.Description,
                UserId = _currentUser.Id!.Value
            });
            matchedTodoItem.Description = request.Description;
        }

        if (matchedTodoItem.Status != request.Status)
        {
            activityLogs.Add(new ActivityLog
            {
                TodoItemId = matchedTodoItem.Id,
                ActionKey = "LOG_STATUS_CHANGED",
                OldValue = matchedTodoItem.Status.ToString(),
                NewValue = request.Status.ToString(),
                UserId = _currentUser.Id!.Value
            });
            matchedTodoItem.Status = request.Status;
        }

        if (matchedTodoItem.Priority != request.Priority)
        {
            activityLogs.Add(new ActivityLog
            {
                TodoItemId = matchedTodoItem.Id,
                ActionKey = "LOG_PRIORITY_CHANGED",
                OldValue = matchedTodoItem.Priority.ToString(),
                NewValue = request.Priority.ToString(),
                UserId = _currentUser.Id!.Value
            });
            matchedTodoItem.Priority = request.Priority;
        }

        if (matchedTodoItem.DueDate != request.DueDate)
        {
            activityLogs.Add(new ActivityLog
            {
                TodoItemId = matchedTodoItem.Id,
                ActionKey = "LOG_DUE_DATE_CHANGED",
                OldValue = matchedTodoItem.DueDate?.ToString("yyyy-MM-dd HH:mm:ss"),
                NewValue = request.DueDate?.ToString("yyyy-MM-dd HH:mm:ss"),
                UserId = _currentUser.Id!.Value
            });
            matchedTodoItem.DueDate = request.DueDate;
        }

        if (matchedTodoItem.CategoryId != request.CategoryId)
        {
            activityLogs.Add(new ActivityLog
            {
                TodoItemId = matchedTodoItem.Id,
                ActionKey = "LOG_CATEGORY_CHANGED",
                OldValue = matchedTodoItem.CategoryId.ToString(),
                NewValue = request.CategoryId.ToString(),
                UserId = _currentUser.Id!.Value
            });
            matchedTodoItem.CategoryId = request.CategoryId;
        }

        matchedTodoItem = await _todoItemRepository.UpdateAsync(matchedTodoItem, cancellationToken);

        if (activityLogs.Any())
        {
            await _activityLogRepository.AddRangeAsync(activityLogs, cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<TodoItemResponseDto>(matchedTodoItem);
    }

    public async Task<TodoItemResponseDto> UpdateStatusAsync(Guid id, UpdateTodoItemStatusRequestDto request, CancellationToken cancellationToken = default)
    {
        var matchedTodoItem = await _todoItemRepository.GetAsync(
            predicate: ti => ti.Id == id && ti.UserId == _currentUser.Id,
            enableTracking: true,
            cancellationToken: cancellationToken
        );

        var oldStatus = matchedTodoItem.Status;
        matchedTodoItem.Status = request.Status;

        matchedTodoItem = await _todoItemRepository.UpdateAsync(matchedTodoItem, cancellationToken);

        var activityLog = new ActivityLog
        {
            TodoItemId = matchedTodoItem.Id,
            ActionKey = "LOG_STATUS_CHANGED",
            OldValue = oldStatus.ToString(),
            NewValue = request.Status.ToString(),
            UserId = _currentUser.Id!.Value
        };

        await _activityLogRepository.AddAsync(activityLog, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<TodoItemResponseDto>(matchedTodoItem);
    }

    public async Task<TodoItemResponseDto> ArchiveAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var matchedTodoItem = await _todoItemRepository.GetAsync(
            predicate: ti => ti.Id == id && ti.UserId == _currentUser.Id && !ti.IsArchived,
            enableTracking: true,
            cancellationToken: cancellationToken
        );

        matchedTodoItem.IsArchived = true;
        matchedTodoItem.ArchivedTime = DateTime.UtcNow;

        matchedTodoItem = await _todoItemRepository.UpdateAsync(matchedTodoItem, cancellationToken);

        var activityLog = new ActivityLog
        {
            TodoItemId = matchedTodoItem.Id,
            ActionKey = "LOG_TODO_ITEM_ARCHIVED",
            OldValue = matchedTodoItem.Title,
            UserId = _currentUser.Id!.Value
        };

        await _activityLogRepository.AddAsync(activityLog, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<TodoItemResponseDto>(matchedTodoItem);
    }

    public async Task ArchiveCompletedAsync(CancellationToken cancellationToken = default)
    {
        var completedTodoItems = await _todoItemRepository.GetAllAsync(
            predicate: ti => ti.UserId == _currentUser.Id && 
                           !ti.IsArchived && 
                           ti.Status == TodoStatus.Completed,
            enableTracking: true,
            cancellationToken: cancellationToken
        );

        if (!completedTodoItems.Any())
        {
            return;
        }

        var activityLogs = new List<ActivityLog>();
        var now = DateTime.UtcNow;

        foreach (var todoItem in completedTodoItems)
        {
            todoItem.IsArchived = true;
            todoItem.ArchivedTime = now;

            activityLogs.Add(new ActivityLog
            {
                TodoItemId = todoItem.Id,
                ActionKey = "LOG_TODO_ITEM_ARCHIVED",
                OldValue = todoItem.Title,
                UserId = _currentUser.Id!.Value
            });
        }

        await _todoItemRepository.UpdateRangeAsync(completedTodoItems, cancellationToken);
        await _activityLogRepository.AddRangeAsync(activityLogs, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var matchedTodoItem = await _todoItemRepository.GetAsync(
            predicate: ti => ti.Id == id && ti.UserId == _currentUser.Id,
            cancellationToken: cancellationToken
        );

        var activityLog = new ActivityLog
        {
            TodoItemId = matchedTodoItem.Id,
            ActionKey = "LOG_TODO_ITEM_DELETED",
            OldValue = matchedTodoItem.Title,
            UserId = _currentUser.Id!.Value
        };

        await _activityLogRepository.AddAsync(activityLog, cancellationToken);
        await _todoItemRepository.DeleteAsync(matchedTodoItem, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}

