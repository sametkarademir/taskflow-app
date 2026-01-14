import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { createRoleAsync } from "../services/roleService";
import type { CreateRoleRequestDto } from "../types/createRoleRequestDto";
import type { RoleResponseDto } from "../types/roleResponseDto";

type UseCreateRoleOptionsType = Omit<
  UseMutationOptions<RoleResponseDto, Error, { params: CreateRoleRequestDto }>,
  "mutationFn"
>;

export const useCreateRole = (options: UseCreateRoleOptionsType = {}) => {
  return useMutation<RoleResponseDto, Error, { params: CreateRoleRequestDto }>({
    mutationFn: async ({ params }: { params: CreateRoleRequestDto }) => {
      return await createRoleAsync(params);
    },
    ...options,
  });
};
