using TaskFlow.Application.Contracts.Common;
using TaskFlow.Domain.Shared.Localization;
using FluentValidation;
using Microsoft.Extensions.Localization;

namespace TaskFlow.Application.Contracts.ActivityLogs;

public class GetListActivityLogsRequestDto : GetListRequestDto
{
}

public class GetListActivityLogsRequestDtoValidator : AbstractValidator<GetListActivityLogsRequestDto>
{
    public GetListActivityLogsRequestDtoValidator(IStringLocalizer<ApplicationResource> localizer)
    {
        Include(new GetListRequestDtoValidator(localizer));
    }
}

