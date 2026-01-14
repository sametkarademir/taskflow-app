import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { getPageableAndFilterUsersAsync } from "../services/userService";
import type { GetListUsersRequestDto } from "../types/getListUsersRequestDto";
import type { UserResponseDto } from "../types/userResponseDto";
import type { PagedResult } from "../../common/types/pagedResult";

type UseGetPageableAndFilterUsersOptionsType = Omit<
  UseQueryOptions<PagedResult<UserResponseDto>, Error>,
  "queryKey" | "queryFn"
>;

export const useGetPageableAndFilterUsers = (
  params: GetListUsersRequestDto,
  options: UseGetPageableAndFilterUsersOptionsType = {},
) => {
  return useQuery<PagedResult<UserResponseDto>, Error>({
    queryKey: ["users", "paged", params],
    queryFn: async () => {
      return await getPageableAndFilterUsersAsync(params);
    },
    ...options,
  });
};

