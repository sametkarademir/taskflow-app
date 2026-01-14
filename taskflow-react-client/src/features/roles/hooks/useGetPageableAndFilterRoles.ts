import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { getPageableAndFilterRolesAsync } from "../services/roleService";
import type { GetListRolesRequestDto } from "../types/getListRolesRequestDto";
import type { RoleResponseDto } from "../types/roleResponseDto";
import type { PagedResult } from "../../common/types/pagedResult";

type UseGetPageableAndFilterRolesOptionsType = Omit<
  UseQueryOptions<PagedResult<RoleResponseDto>, Error>,
  "queryKey" | "queryFn"
>;

export const useGetPageableAndFilterRoles = (
  params: GetListRolesRequestDto,
  options: UseGetPageableAndFilterRolesOptionsType = {},
) => {
  return useQuery<PagedResult<RoleResponseDto>, Error>({
    queryKey: ["roles", "pageable", params],
    queryFn: () => getPageableAndFilterRolesAsync(params),
    ...options,
  });
};
