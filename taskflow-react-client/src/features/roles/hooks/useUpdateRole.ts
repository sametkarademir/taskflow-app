import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { updateRoleAsync } from "../services/roleService";
import type { UpdateRoleRequestDto } from "../types/updateRoleRequestDto";
import type { RoleResponseDto } from "../types/roleResponseDto";

type UseUpdateRoleOptionsType = Omit<
  UseMutationOptions<
    RoleResponseDto,
    Error,
    { id: string; params: UpdateRoleRequestDto }
  >,
  "mutationFn"
>;

export const useUpdateRole = (options: UseUpdateRoleOptionsType = {}) => {
  return useMutation<
    RoleResponseDto,
    Error,
    { id: string; params: UpdateRoleRequestDto }
  >({
    mutationFn: async ({
      id,
      params,
    }: {
      id: string;
      params: UpdateRoleRequestDto;
    }) => {
      return await updateRoleAsync(id, params);
    },
    ...options,
  });
};
