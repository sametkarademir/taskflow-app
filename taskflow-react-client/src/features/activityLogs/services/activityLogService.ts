import apiClient from "../../common/helpers/axios";

import type { PagedResult } from "../../common/types/pagedResult";

import type { ActivityLogResponseDto } from "../types/activityLogResponseDto";
import type { GetListActivityLogsRequestDto } from "../types/getListActivityLogsRequestDto";

export async function getPagedAndFilterActivityLogsAsync(
  todoItemId: string,
  params: GetListActivityLogsRequestDto,
): Promise<PagedResult<ActivityLogResponseDto>> {
  const response = await apiClient.get<PagedResult<ActivityLogResponseDto>>(
    `/api/v1/todo-items/${todoItemId}/activity-logs/paged`,
    { params },
  );
  return response.data;
}
