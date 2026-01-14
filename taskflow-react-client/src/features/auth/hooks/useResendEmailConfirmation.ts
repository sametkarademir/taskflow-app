import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { resendEmailConfirmationAsync } from "../services/authService";

type UseResendEmailConfirmationOptionsType = Omit<
  UseMutationOptions<void, Error, { email: string }>,
  "mutationFn"
>;

export const useResendEmailConfirmation = (
  options: UseResendEmailConfirmationOptionsType = {},
) => {
  return useMutation<void, Error, { email: string }>({
    mutationFn: async ({ email }: { email: string }) => {
      await resendEmailConfirmationAsync(email);
    },
    ...options,
  });
};

