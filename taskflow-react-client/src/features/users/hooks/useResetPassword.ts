import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { resetPasswordAsync } from "../services/userService";
import type { ResetPasswordUserRequestDto } from "../types/resetPasswordUserRequestDto";

type UseResetPasswordOptionsType = Omit<
  UseMutationOptions<
    void,
    Error,
    { id: string; data: ResetPasswordUserRequestDto }
  >,
  "mutationFn"
>;

export const useResetPassword = (
  options: UseResetPasswordOptionsType = {},
) => {
  return useMutation<
    void,
    Error,
    { id: string; data: ResetPasswordUserRequestDto }
  >({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: ResetPasswordUserRequestDto;
    }) => {
      await resetPasswordAsync(id, data);
    },
    ...options,
  });
};

