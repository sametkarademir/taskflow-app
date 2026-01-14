using AutoMapper;
using TaskFlow.Application.Contracts.Common.Results;
using TaskFlow.Application.Contracts.TodoComments;
using TaskFlow.Application.Contracts.Users;
using TaskFlow.Domain.ActivityLogs;
using TaskFlow.Domain.Repositories;
using TaskFlow.Domain.Shared.BaseEntities.Abstractions;
using TaskFlow.Domain.Shared.Exceptions.Types;
using TaskFlow.Domain.Shared.Extensions;
using TaskFlow.Domain.Shared.Localization;
using TaskFlow.Domain.Shared.Repositories;
using TaskFlow.Domain.TodoComments;
using TaskFlow.Domain.TodoItems;
using Microsoft.Extensions.Localization;

namespace TaskFlow.Application.TodoComments;

public class TodoCommentAppService : ITodoCommentAppService
{
    private readonly ITodoCommentRepository _todoCommentRepository;
    private readonly ITodoItemRepository _todoItemRepository;
    private readonly IActivityLogRepository _activityLogRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUser _currentUser;
    private readonly IStringLocalizer<ApplicationResource> _localizer;

    public TodoCommentAppService(
        ITodoCommentRepository todoCommentRepository,
        ITodoItemRepository todoItemRepository,
        IActivityLogRepository activityLogRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUser currentUser,
        IStringLocalizer<ApplicationResource> localizer)
    {
        _todoCommentRepository = todoCommentRepository;
        _todoItemRepository = todoItemRepository;
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

    public async Task<TodoCommentResponseDto> CreateAsync(Guid todoItemId, CreateTodoCommentRequestDto request, CancellationToken cancellationToken = default)
    {
        var matchedTodoItem = await _todoItemRepository.GetAsync(
            predicate: ti => ti.Id == todoItemId && ti.UserId == _currentUser.Id,
            enableTracking: false,
            cancellationToken: cancellationToken
        );

        var newTodoComment = new TodoComment
        {
            Content = request.Content,
            TodoItemId = todoItemId,
            UserId = _currentUser.Id!.Value
        };

        newTodoComment = await _todoCommentRepository.AddAsync(newTodoComment, cancellationToken);

        var activityLog = new ActivityLog
        {
            TodoItemId = todoItemId,
            ActionKey = "LOG_TODO_COMMENT_CREATED",
            NewValue = request.Content,
            UserId = _currentUser.Id.Value
        };

        await _activityLogRepository.AddAsync(activityLog, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<TodoCommentResponseDto>(newTodoComment);
    }

    public async Task<PagedResult<TodoCommentResponseDto>> GetPagedAndFilterAsync(Guid todoItemId, GetListTodoCommentsRequestDto request, CancellationToken cancellationToken = default)
    {
        var pagedComments = await _todoCommentRepository.GetListSortedAsync(
            page: request.Page,
            perPage: request.PerPage,
            predicate: tc => tc.TodoItemId == todoItemId && tc.UserId == _currentUser.Id,
            sort: request.GetSortRequest(nameof(CreationAuditedEntity<Guid>.CreationTime)),
            enableTracking: false,
            cancellationToken: cancellationToken
        );

        var mappedComments = _mapper.Map<List<TodoCommentResponseDto>>(pagedComments.Data);

        return new PagedResult<TodoCommentResponseDto>(mappedComments, pagedComments.TotalCount, pagedComments.Page, pagedComments.PerPage);
    }
}

