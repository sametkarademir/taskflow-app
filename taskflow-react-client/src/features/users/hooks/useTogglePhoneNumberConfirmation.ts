import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { togglePhoneNumberConfirmationAsync } from "../services/userService";

type UseTogglePhoneNumberConfirmationOptionsType = Omit<
  UseMutationOptions<void, Error, string>,
  "mutationFn"
>;

export const useTogglePhoneNumberConfirmation = (
  options: UseTogglePhoneNumberConfirmationOptionsType = {},
) => {
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await togglePhoneNumberConfirmationAsync(id);
    },
    ...options,
  });
};

