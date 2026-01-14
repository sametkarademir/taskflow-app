import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { deleteUserAsync } from "../services/userService";

type UseDeleteUserOptionsType = Omit<
  UseMutationOptions<void, Error, string>,
  "mutationFn"
>;

export const useDeleteUser = (options: UseDeleteUserOptionsType = {}) => {
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await deleteUserAsync(id);
    },
    ...options,
  });
};

