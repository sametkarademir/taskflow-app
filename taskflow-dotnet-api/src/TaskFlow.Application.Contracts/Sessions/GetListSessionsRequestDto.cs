using TaskFlow.Application.Contracts.Common;
using TaskFlow.Domain.Shared.Localization;
using FluentValidation;
using Microsoft.Extensions.Localization;

namespace TaskFlow.Application.Contracts.Sessions;

public class GetListSessionsRequestDto : GetListRequestDto
{
    public bool? IsMobile { get; set; }
    public bool? IsDesktop { get; set; }
    public bool? IsTablet { get; set; }
}

public class GetListSessionsRequestDtoValidator : AbstractValidator<GetListSessionsRequestDto>
{
    public GetListSessionsRequestDtoValidator(IStringLocalizer<ApplicationResource> localizer)
    {
        Include(new GetListRequestDtoValidator(localizer));
    }
}