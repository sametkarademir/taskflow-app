import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { lockUserAsync } from "../services/userService";

type UseLockUserOptionsType = Omit<
  UseMutationOptions<void, Error, string>,
  "mutationFn"
>;

export const useLockUser = (options: UseLockUserOptionsType = {}) => {
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await lockUserAsync(id);
    },
    ...options,
  });
};

