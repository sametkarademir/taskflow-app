import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { toggleTwoFactorEnabledAsync } from "../services/userService";

type UseToggleTwoFactorEnabledOptionsType = Omit<
  UseMutationOptions<void, Error, string>,
  "mutationFn"
>;

export const useToggleTwoFactorEnabled = (
  options: UseToggleTwoFactorEnabledOptionsType = {},
) => {
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await toggleTwoFactorEnabledAsync(id);
    },
    ...options,
  });
};

