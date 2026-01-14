import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { getAllRolesAsync } from "../services/roleService";
import type { RoleResponseDto } from "../types/roleResponseDto";

type UseGetAllRolesOptionsType = Omit<
  UseQueryOptions<RoleResponseDto[], Error>,
  "queryKey" | "queryFn"
>;

export const useGetAllRoles = (options: UseGetAllRolesOptionsType = {}) => {
  return useQuery<RoleResponseDto[], Error>({
    queryKey: ["roles", "all"],
    queryFn: getAllRolesAsync,
    ...options,
  });
};
