import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { getRoleByIdAsync } from "../services/roleService";
import type { RoleResponseDto } from "../types/roleResponseDto";

type UseGetRoleByIdOptionsType = Omit<
  UseQueryOptions<RoleResponseDto, Error>,
  "queryKey" | "queryFn"
>;

export const useGetRoleById = (
  id: string,
  options: UseGetRoleByIdOptionsType = {},
) => {
  return useQuery<RoleResponseDto, Error>({
    queryKey: ["roles", id],
    queryFn: () => getRoleByIdAsync(id),
    enabled: !!id,
    ...options,
  });
};
