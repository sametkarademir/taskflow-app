import apiClient from "../../common/helpers/axios";

import type { PagedResult } from "../../common/types/pagedResult";
import type { CreateRoleRequestDto } from "../types/createRoleRequestDto";
import type { UpdateRoleRequestDto } from "../types/updateRoleRequestDto";
import type { GetListRolesRequestDto } from "../types/getListRolesRequestDto";
import type { RoleResponseDto } from "../types/roleResponseDto";
import type { SyncRolePermissionsRequestDto } from "../types/syncRolePermissionsRequestDto";

const roleRoute = "/api/v1/roles";

export async function getRoleByIdAsync(id: string): Promise<RoleResponseDto> {
  const response = await apiClient.get<RoleResponseDto>(`${roleRoute}/${id}`);
  return response.data;
}

export async function getAllRolesAsync(): Promise<RoleResponseDto[]> {
  const response = await apiClient.get<RoleResponseDto[]>(roleRoute);
  return response.data;
}

export async function getPageableAndFilterRolesAsync(
  params: GetListRolesRequestDto,
): Promise<PagedResult<RoleResponseDto>> {
  const response = await apiClient.get<PagedResult<RoleResponseDto>>(
    `${roleRoute}/paged`,
    { params },
  );
  return response.data;
}

export async function createRoleAsync(
  requestBody: CreateRoleRequestDto,
): Promise<RoleResponseDto> {
  const response = await apiClient.post<RoleResponseDto>(
    roleRoute,
    requestBody,
  );
  return response.data;
}

export async function updateRoleAsync(
  id: string,
  requestBody: UpdateRoleRequestDto,
): Promise<RoleResponseDto> {
  const response = await apiClient.put<RoleResponseDto>(
    `${roleRoute}/${id}`,
    requestBody,
  );
  return response.data;
}

export async function deleteRoleAsync(id: string): Promise<void> {
  await apiClient.delete(`${roleRoute}/${id}`);
}

export async function addRoleToPermissionAsync(
  id: string,
  permissionId: string,
): Promise<void> {
  await apiClient.patch(`${roleRoute}/${id}/assign/${permissionId}`);
}

export async function removeRoleFromPermissionAsync(
  id: string,
  permissionId: string,
): Promise<void> {
  await apiClient.patch(`${roleRoute}/${id}/unassign/${permissionId}`);
}

export async function syncRolePermissionsAsync(
  id: string,
  requestBody: SyncRolePermissionsRequestDto,
): Promise<void> {
  await apiClient.patch(`${roleRoute}/${id}/sync-permissions`, requestBody);
}
