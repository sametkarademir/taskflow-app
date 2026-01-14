import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { confirmEmailAsync } from "../services/authService";
import type { ConfirmEmailRequestDto } from "../types/confirmEmailRequestDto";

type UseConfirmEmailOptionsType = Omit<
  UseMutationOptions<void, Error, { params: ConfirmEmailRequestDto }>,
  "mutationFn"
>;

export const useConfirmEmail = (options: UseConfirmEmailOptionsType = {}) => {
  return useMutation<void, Error, { params: ConfirmEmailRequestDto }>({
    mutationFn: async ({ params }: { params: ConfirmEmailRequestDto }) => {
      await confirmEmailAsync(params);
    },
    ...options,
  });
};