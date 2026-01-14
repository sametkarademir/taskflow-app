import apiClient from "../../common/helpers/axios";

import type { PagedResult } from "../../common/types/pagedResult";

import type { UserResponseDto } from "../types/userResponseDto";
import type { CreateUserRequestDto } from "../types/createUserRequestDto";
import type { UpdateUserRequestDto } from "../types/updateUserRequestDto";
import type { GetListUsersRequestDto } from "../types/getListUsersRequestDto";
import type { ResetPasswordUserRequestDto } from "../types/resetPasswordUserRequestDto";
import type { SyncUserRolesRequestDto } from "../types/syncUserRolesRequestDto";

const userRoute = "/api/v1/users";

export async function getUserByIdAsync(
  id: string,
): Promise<UserResponseDto> {
  const response = await apiClient.get<UserResponseDto>(
    `${userRoute}/${id}`,
  );
  return response.data;
}

export async function getAllUsersAsync(): Promise<UserResponseDto[]> {
  const response = await apiClient.get<UserResponseDto[]>(userRoute);
  return response.data;
}

export async function getPageableAndFilterUsersAsync(
  params: GetListUsersRequestDto,
): Promise<PagedResult<UserResponseDto>> {
  const response = await apiClient.get<PagedResult<UserResponseDto>>(
    `${userRoute}/paged`,
    { params },
  );
  return response.data;
}

export async function createUserAsync(
  data: CreateUserRequestDto,
): Promise<UserResponseDto> {
  const response = await apiClient.post<UserResponseDto>(userRoute, data);
  return response.data;
}

export async function updateUserAsync(
  id: string,
  data: UpdateUserRequestDto,
): Promise<UserResponseDto> {
  const response = await apiClient.put<UserResponseDto>(
    `${userRoute}/${id}`,
    data,
  );
  return response.data;
}

export async function deleteUserAsync(id: string): Promise<void> {
  await apiClient.delete(`${userRoute}/${id}`);
}

export async function toggleEmailConfirmationAsync(id: string): Promise<void> {
  await apiClient.patch(`${userRoute}/${id}/email-confirmation`);
}

export async function togglePhoneNumberConfirmationAsync(
  id: string,
): Promise<void> {
  await apiClient.patch(`${userRoute}/${id}/phone-number-confirmation`);
}

export async function toggleTwoFactorEnabledAsync(id: string): Promise<void> {
  await apiClient.patch(`${userRoute}/${id}/two-factor-enabled`);
}

export async function toggleIsActiveAsync(id: string): Promise<void> {
  await apiClient.patch(`${userRoute}/${id}/is-active`);
}

export async function addUserToRoleAsync(
  id: string,
  roleId: string,
): Promise<void> {
  await apiClient.patch(`${userRoute}/${id}/assign/${roleId}`);
}

export async function removeUserFromRoleAsync(
  id: string,
  roleId: string,
): Promise<void> {
  await apiClient.patch(`${userRoute}/${id}/unassign/${roleId}`);
}

export async function syncUserRolesAsync(
  id: string,
  data: SyncUserRolesRequestDto,
): Promise<void> {
  await apiClient.patch(`${userRoute}/${id}/sync-roles`, data);
}

export async function lockUserAsync(id: string): Promise<void> {
  await apiClient.patch(`${userRoute}/${id}/lock`);
}

export async function unlockUserAsync(id: string): Promise<void> {
  await apiClient.patch(`${userRoute}/${id}/unlock`);
}

export async function resetPasswordAsync(
  id: string,
  data: ResetPasswordUserRequestDto,
): Promise<void> {
  await apiClient.patch(`${userRoute}/${id}/reset-password`, data);
}

