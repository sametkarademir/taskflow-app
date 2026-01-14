import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { toggleEmailConfirmationAsync } from "../services/userService";

type UseToggleEmailConfirmationOptionsType = Omit<
  UseMutationOptions<void, Error, string>,
  "mutationFn"
>;

export const useToggleEmailConfirmation = (
  options: UseToggleEmailConfirmationOptionsType = {},
) => {
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await toggleEmailConfirmationAsync(id);
    },
    ...options,
  });
};

