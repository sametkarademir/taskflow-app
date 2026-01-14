import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { syncUserRolesAsync } from "../services/userService";

type UseSyncUserRolesOptionsType = Omit<
  UseMutationOptions<void, Error, { id: string; roleIds: string[] }>,
  "mutationFn"
>;

export const useSyncUserRoles = (
  options: UseSyncUserRolesOptionsType = {},
) => {
  return useMutation<void, Error, { id: string; roleIds: string[] }>({
    mutationFn: async ({
      id,
      roleIds,
    }: {
      id: string;
      roleIds: string[];
    }) => {
      await syncUserRolesAsync(id, { roleIds });
    },
    ...options,
  });
};

