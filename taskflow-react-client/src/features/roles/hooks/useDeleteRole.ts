import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { deleteRoleAsync } from "../services/roleService";

type UseDeleteRoleOptionsType = Omit<
  UseMutationOptions<void, Error, { id: string }>,
  "mutationFn"
>;

export const useDeleteRole = (options: UseDeleteRoleOptionsType = {}) => {
  return useMutation<void, Error, { id: string }>({
    mutationFn: async ({ id }: { id: string }) => {
      await deleteRoleAsync(id);
    },
    ...options,
  });
};
