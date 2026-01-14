import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { verifyResetPasswordCodeAsync } from "../services/authService";
import type { VerifyResetPasswordCodeRequestDto } from "../types/verifyResetPasswordCodeRequestDto";

type UseVerifyResetPasswordCodeOptionsType = Omit<
  UseMutationOptions<
    void,
    Error,
    { params: VerifyResetPasswordCodeRequestDto }
  >,
  "mutationFn"
>;

export const useVerifyResetPasswordCode = (
  options: UseVerifyResetPasswordCodeOptionsType = {},
) => {
  return useMutation<
    void,
    Error,
    { params: VerifyResetPasswordCodeRequestDto }
  >({
    mutationFn: async ({
      params,
    }: {
      params: VerifyResetPasswordCodeRequestDto;
    }) => {
      await verifyResetPasswordCodeAsync(params);
    },
    ...options,
  });
};
