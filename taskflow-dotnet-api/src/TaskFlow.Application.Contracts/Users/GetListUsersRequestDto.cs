using TaskFlow.Application.Contracts.Common;
using TaskFlow.Domain.Shared.Localization;
using FluentValidation;
using Microsoft.Extensions.Localization;

namespace TaskFlow.Application.Contracts.Users;

public class GetListUsersRequestDto : GetListRequestDto
{
    public bool? IsActive { get; set; }
}

public class GetListUsersRequestDtoValidator : AbstractValidator<GetListUsersRequestDto>
{
    public GetListUsersRequestDtoValidator(IStringLocalizer<ApplicationResource> localizer)
    {
        Include(new GetListRequestDtoValidator(localizer));
    }
}