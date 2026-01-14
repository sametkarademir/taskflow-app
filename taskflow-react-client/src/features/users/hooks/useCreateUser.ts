import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { createUserAsync } from "../services/userService";
import type { CreateUserRequestDto } from "../types/createUserRequestDto";
import type { UserResponseDto } from "../types/userResponseDto";

type UseCreateUserOptionsType = Omit<
  UseMutationOptions<UserResponseDto, Error, { params: CreateUserRequestDto }>,
  "mutationFn"
>;

export const useCreateUser = (options: UseCreateUserOptionsType = {}) => {
  return useMutation<UserResponseDto, Error, { params: CreateUserRequestDto }>({
    mutationFn: async ({ params }: { params: CreateUserRequestDto }) => {
      return await createUserAsync(params);
    },
    ...options,
  });
};

