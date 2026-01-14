using TaskFlow.Application.Contracts.Common;
using TaskFlow.Domain.Shared.Localization;
using FluentValidation;
using Microsoft.Extensions.Localization;

namespace TaskFlow.Application.Contracts.Roles;

public class GetListRolesRequestDto : GetListRequestDto
{

}

public class GetListRolesRequestDtoValidator : AbstractValidator<GetListRolesRequestDto>
{
    public GetListRolesRequestDtoValidator(IStringLocalizer<ApplicationResource> localizer)
    {
        Include(new GetListRequestDtoValidator(localizer));
    }
}