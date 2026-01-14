using TaskFlow.Application.Contracts.Common;
using TaskFlow.Domain.Shared.Localization;
using FluentValidation;
using Microsoft.Extensions.Localization;

namespace TaskFlow.Application.Contracts.Categories;

public class GetListCategoriesRequestDto : GetListRequestDto
{

}

public class GetListCategoriesRequestDtoValidator : AbstractValidator<GetListCategoriesRequestDto>
{
    public GetListCategoriesRequestDtoValidator(IStringLocalizer<ApplicationResource> localizer)
    {
        Include(new GetListRequestDtoValidator(localizer));
    }
}

