using AutoMapper;
using TaskFlow.Application.Contracts.Categories;
using TaskFlow.Application.Contracts.Common.Results;
using TaskFlow.Application.Contracts.Users;
using TaskFlow.Domain.Categories;
using TaskFlow.Domain.Repositories;
using TaskFlow.Domain.Shared.BaseEntities.Abstractions;
using TaskFlow.Domain.Shared.Exceptions.Types;
using TaskFlow.Domain.Shared.Localization;
using TaskFlow.Domain.Shared.Repositories;
using Microsoft.Extensions.Localization;

namespace TaskFlow.Application.Categories;

public class CategoryAppService : ICategoryAppService
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly ITodoItemRepository _todoItemRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUser _currentUser;
    private readonly IStringLocalizer<ApplicationResource> _localizer;

    public CategoryAppService(
        ICategoryRepository categoryRepository,
        ITodoItemRepository todoItemRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ICurrentUser currentUser,
        IStringLocalizer<ApplicationResource> localizer)
    {
        _categoryRepository = categoryRepository;
        _todoItemRepository = todoItemRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUser = currentUser;
        _localizer = localizer;

        if (!_currentUser.IsAuthenticated || _currentUser.Id == null)
        {
            throw new AppUnauthorizedException();
        }
    }

    public async Task<CategoryResponseDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var matchedCategory = await _categoryRepository.GetAsync(
            predicate: c => c.Id == id && c.UserId == _currentUser.Id,
            enableTracking: false,
            cancellationToken: cancellationToken
        );

        return _mapper.Map<CategoryResponseDto>(matchedCategory);
    }

    public async Task<PagedResult<CategoryResponseDto>> GetPagedAndFilterAsync(GetListCategoriesRequestDto request, CancellationToken cancellationToken = default)
    {
        var pagedCategories = await _categoryRepository.GetListSortedAsync(
            page: request.Page,
            perPage: request.PerPage,
            predicate: c => 
                c.UserId == _currentUser.Id &&
                (string.IsNullOrWhiteSpace(request.Search) || c.Name.Contains(request.Search)),
            sort: request.GetSortRequest(nameof(CreationAuditedEntity<Guid>.CreationTime)),
            enableTracking: false,
            cancellationToken: cancellationToken
        );

        var mappedCategories = _mapper.Map<List<CategoryResponseDto>>(pagedCategories.Data);

        return new PagedResult<CategoryResponseDto>(mappedCategories, pagedCategories.TotalCount, pagedCategories.Page, pagedCategories.PerPage);
    }

    public async Task<CategoryResponseDto> CreateAsync(CreateCategoryRequestDto request, CancellationToken cancellationToken = default)
    {
        var newCategory = new Category
        {
            Name = request.Name,
            Description = request.Description,
            ColorHex = request.ColorHex,
            UserId = _currentUser.Id!.Value
        };

        newCategory = await _categoryRepository.AddAsync(newCategory, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<CategoryResponseDto>(newCategory);
    }

    public async Task<CategoryResponseDto> UpdateAsync(Guid id, UpdateCategoryRequestDto request, CancellationToken cancellationToken = default)
    {
        var matchedCategory = await _categoryRepository.GetAsync(
            predicate: c => c.Id == id && c.UserId == _currentUser.Id,
            enableTracking: true,
            cancellationToken: cancellationToken
        );

        matchedCategory.Name = request.Name;
        matchedCategory.Description = request.Description;
        matchedCategory.ColorHex = request.ColorHex;

        matchedCategory = await _categoryRepository.UpdateAsync(matchedCategory, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<CategoryResponseDto>(matchedCategory);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var matchedCategory = await _categoryRepository.GetAsync(
            predicate: c => c.Id == id && c.UserId == _currentUser.Id,
            cancellationToken: cancellationToken
        );

        var hasTodoItems = await _todoItemRepository.AnyAsync(
            predicate: ti => ti.CategoryId == id && ti.UserId == _currentUser.Id,
            cancellationToken: cancellationToken
        );

        if (hasTodoItems)
        {
            throw new AppValidationException(_localizer["CategoryAppService:DeleteAsync:HasTodoItems"]);
        }

        await _categoryRepository.DeleteAsync(matchedCategory, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}

