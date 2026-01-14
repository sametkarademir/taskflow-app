import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { addUserToRoleAsync } from "../services/userService";

type UseAddUserToRoleOptionsType = Omit<
  UseMutationOptions<void, Error, { id: string; roleId: string }>,
  "mutationFn"
>;

export const useAddUserToRole = (
  options: UseAddUserToRoleOptionsType = {},
) => {
  return useMutation<void, Error, { id: string; roleId: string }>({
    mutationFn: async ({ id, roleId }: { id: string; roleId: string }) => {
      await addUserToRoleAsync(id, roleId);
    },
    ...options,
  });
};

