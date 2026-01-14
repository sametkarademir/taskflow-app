import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { resetPasswordAsync } from "../services/authService";
import type { ResetPasswordRequestDto } from "../types/resetPasswordRequestDto";

type UseResetPasswordOptionsType = Omit<
  UseMutationOptions<void, Error, { params: ResetPasswordRequestDto }>,
  "mutationFn"
>;

export const useResetPassword = (options: UseResetPasswordOptionsType = {}) => {
  return useMutation<void, Error, { params: ResetPasswordRequestDto }>({
    mutationFn: async ({ params }: { params: ResetPasswordRequestDto }) => {
      await resetPasswordAsync(params);
    },
    ...options,
  });
};
