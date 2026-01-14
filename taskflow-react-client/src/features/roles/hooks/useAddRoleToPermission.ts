import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { addRoleToPermissionAsync } from "../services/roleService";

type UseAddRoleToPermissionOptionsType = Omit<
  UseMutationOptions<void, Error, { id: string; permissionId: string }>,
  "mutationFn"
>;

export const useAddRoleToPermission = (
  options: UseAddRoleToPermissionOptionsType = {},
) => {
  return useMutation<void, Error, { id: string; permissionId: string }>({
    mutationFn: async ({
      id,
      permissionId,
    }: {
      id: string;
      permissionId: string;
    }) => {
      await addRoleToPermissionAsync(id, permissionId);
    },
    ...options,
  });
};
