import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { getPagedAndFilterActivityLogsAsync } from "../services/activityLogService";
import type { GetListActivityLogsRequestDto } from "../types/getListActivityLogsRequestDto";
import type { ActivityLogResponseDto } from "../types/activityLogResponseDto";
import type { PagedResult } from "../../common/types/pagedResult";

type UseGetPagedAndFilterActivityLogsOptionsType = Omit<
  UseQueryOptions<PagedResult<ActivityLogResponseDto>, Error>,
  "queryKey" | "queryFn"
>;

export const useGetPagedAndFilterActivityLogs = (
  todoItemId: string,
  params: GetListActivityLogsRequestDto,
  options: UseGetPagedAndFilterActivityLogsOptionsType = {},
) => {
  return useQuery<PagedResult<ActivityLogResponseDto>, Error>({
    queryKey: ["activityLogs", "paged", todoItemId, params],
    queryFn: async () => {
      return await getPagedAndFilterActivityLogsAsync(todoItemId, params);
    },
    enabled: !!todoItemId,
    ...options,
  });
};
