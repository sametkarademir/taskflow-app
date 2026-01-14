import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { updateUserAsync } from "../services/userService";
import type { UpdateUserRequestDto } from "../types/updateUserRequestDto";
import type { UserResponseDto } from "../types/userResponseDto";

type UseUpdateUserOptionsType = Omit<
  UseMutationOptions<
    UserResponseDto,
    Error,
    { id: string; data: UpdateUserRequestDto }
  >,
  "mutationFn"
>;

export const useUpdateUser = (options: UseUpdateUserOptionsType = {}) => {
  return useMutation<
    UserResponseDto,
    Error,
    { id: string; data: UpdateUserRequestDto }
  >({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserRequestDto }) => {
      return await updateUserAsync(id, data);
    },
    ...options,
  });
};

