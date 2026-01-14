import apiClient from "../../common/helpers/axios.ts";

import type { LoginRequestDto } from "../types/loginRequestDto";
import type { LoginResponseDto } from "../types/loginResponseDto";
import type { RefreshTokenRequestDto } from "../types/refreshTokenRequestDto";
import type { RegisterRequestDto } from "../types/registerRequestDto";
import type { ConfirmEmailRequestDto } from "../types/confirmEmailRequestDto";
import type { ForgotPasswordRequestDto } from "../types/forgotPasswordRequestDto";
import type { VerifyResetPasswordCodeRequestDto } from "../types/verifyResetPasswordCodeRequestDto";
import type { ResetPasswordRequestDto } from "../types/resetPasswordRequestDto";

const authRoute = "/api/v1/auth";

export async function loginAsync(
  requestBody: LoginRequestDto,
): Promise<LoginResponseDto> {
  const response = await apiClient.post<LoginResponseDto>(
    authRoute + "/login",
    requestBody,
  );

  return response.data;
}

export async function logoutAsync() {
  await apiClient.post(authRoute + "/logout");
}

export async function refreshTokenAsync(
    requestBody: RefreshTokenRequestDto,
): Promise<LoginResponseDto> {
  const response = await apiClient.post<LoginResponseDto>(
      authRoute + "/refresh-token",
      requestBody,
  );

  return response.data;
}

export async function registerAsync(
  requestBody: RegisterRequestDto,
): Promise<void> {
  await apiClient.post(authRoute + "/register", requestBody);
}

export async function confirmEmailAsync(
  requestBody: ConfirmEmailRequestDto,
): Promise<void> {
  await apiClient.post(authRoute + "/confirm-email", requestBody);
}

export async function resendEmailConfirmationAsync(
  email: string,
): Promise<void> {
  await apiClient.post(authRoute + `/resend-email-confirmation/${email}`);
}

export async function forgotPasswordAsync(
  requestBody: ForgotPasswordRequestDto,
): Promise<void> {
  await apiClient.post(authRoute + `/forgot-password/${requestBody.email}`);
}

export async function verifyResetPasswordCodeAsync(
  requestBody: VerifyResetPasswordCodeRequestDto,
): Promise<void> {
  await apiClient.post(authRoute + "/verify-reset-password-code", requestBody);
}

export async function resetPasswordAsync(
  requestBody: ResetPasswordRequestDto,
): Promise<void> {
  await apiClient.post(authRoute + "/reset-password", requestBody);
}
