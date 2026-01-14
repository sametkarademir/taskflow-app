namespace TaskFlow.Application.Contracts.AuthTokens;

public interface IJwtTokenAppService
{
    GenerateJwtTokenResponseDto GenerateJwt(GenerateJwtTokenRequestDto request);
}