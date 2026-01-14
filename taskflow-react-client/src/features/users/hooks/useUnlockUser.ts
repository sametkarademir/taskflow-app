import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { unlockUserAsync } from "../services/userService";

type UseUnlockUserOptionsType = Omit<
  UseMutationOptions<void, Error, string>,
  "mutationFn"
>;

export const useUnlockUser = (options: UseUnlockUserOptionsType = {}) => {
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await unlockUserAsync(id);
    },
    ...options,
  });
};

