import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { registerAsync } from "../services/authService";
import type { RegisterRequestDto } from "../types/registerRequestDto";

type UseRegisterPostOptionsType = Omit<
  UseMutationOptions<void, Error, { params: RegisterRequestDto }>,
  "mutationFn"
>;

export const useRegister = (options: UseRegisterPostOptionsType = {}) => {
  return useMutation<void, Error, { params: RegisterRequestDto }>({
    mutationFn: async ({ params }: { params: RegisterRequestDto }) => {
      await registerAsync(params);
    },
    ...options,
  });
};
