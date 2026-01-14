import apiClient from "../../common/helpers/axios";

import type { PermissionResponseDto } from "../types/permissionResponseDto";

const BASE_URL = "/api/v1/permissions";

export const permissionService = {
  getAllAsync: async (): Promise<PermissionResponseDto[]> => {
    const response = await apiClient.get<PermissionResponseDto[]>(BASE_URL);
    return response.data;
  },
};

