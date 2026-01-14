import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { syncRolePermissionsAsync } from "../services/roleService";
import type { SyncRolePermissionsRequestDto } from "../types/syncRolePermissionsRequestDto";

type UseSyncRolePermissionsOptionsType = Omit<
  UseMutationOptions<void, Error, { id: string; requestBody: SyncRolePermissionsRequestDto }>,
  "mutationFn"
>;

export const useSyncRolePermissions = (
  options: UseSyncRolePermissionsOptionsType = {},
) => {
  return useMutation<void, Error, { id: string; requestBody: SyncRolePermissionsRequestDto }>({
    mutationFn: async ({
      id,
      requestBody,
    }: {
      id: string;
      requestBody: SyncRolePermissionsRequestDto;
    }) => {
      await syncRolePermissionsAsync(id, requestBody);
    },
    ...options,
  });
};

