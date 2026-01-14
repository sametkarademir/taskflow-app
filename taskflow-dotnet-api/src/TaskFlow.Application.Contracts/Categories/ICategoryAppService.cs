using TaskFlow.Application.Contracts.Common.Results;

namespace TaskFlow.Application.Contracts.Categories;

public interface ICategoryAppService
{
    Task<CategoryResponseDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<PagedResult<CategoryResponseDto>> GetPagedAndFilterAsync(GetListCategoriesRequestDto request, CancellationToken cancellationToken = default);
    Task<CategoryResponseDto> CreateAsync(CreateCategoryRequestDto request, CancellationToken cancellationToken = default);
    Task<CategoryResponseDto> UpdateAsync(Guid id, UpdateCategoryRequestDto request, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}

