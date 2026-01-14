import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { removeUserFromRoleAsync } from "../services/userService";

type UseRemoveUserFromRoleOptionsType = Omit<
  UseMutationOptions<void, Error, { id: string; roleId: string }>,
  "mutationFn"
>;

export const useRemoveUserFromRole = (
  options: UseRemoveUserFromRoleOptionsType = {},
) => {
  return useMutation<void, Error, { id: string; roleId: string }>({
    mutationFn: async ({ id, roleId }: { id: string; roleId: string }) => {
      await removeUserFromRoleAsync(id, roleId);
    },
    ...options,
  });
};

