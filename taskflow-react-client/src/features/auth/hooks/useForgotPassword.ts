import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { forgotPasswordAsync } from "../services/authService";
import type { ForgotPasswordRequestDto } from "../types/forgotPasswordRequestDto";

type UseForgotPasswordOptionsType = Omit<
  UseMutationOptions<void, Error, { params: ForgotPasswordRequestDto }>,
  "mutationFn"
>;

export const useForgotPassword = (
  options: UseForgotPasswordOptionsType = {},
) => {
  return useMutation<void, Error, { params: ForgotPasswordRequestDto }>({
    mutationFn: async ({ params }: { params: ForgotPasswordRequestDto }) => {
      await forgotPasswordAsync(params);
    },
    ...options,
  });
};
