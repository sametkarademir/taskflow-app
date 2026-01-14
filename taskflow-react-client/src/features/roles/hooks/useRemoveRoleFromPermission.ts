import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { removeRoleFromPermissionAsync } from "../services/roleService";

type UseRemoveRoleFromPermissionOptionsType = Omit<
  UseMutationOptions<void, Error, { id: string; permissionId: string }>,
  "mutationFn"
>;

export const useRemoveRoleFromPermission = (
  options: UseRemoveRoleFromPermissionOptionsType = {},
) => {
  return useMutation<void, Error, { id: string; permissionId: string }>({
    mutationFn: async ({
      id,
      permissionId,
    }: {
      id: string;
      permissionId: string;
    }) => {
      await removeRoleFromPermissionAsync(id, permissionId);
    },
    ...options,
  });
};
