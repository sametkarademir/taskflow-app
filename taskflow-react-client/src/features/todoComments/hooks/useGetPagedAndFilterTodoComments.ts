import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { getPagedAndFilterTodoCommentsAsync } from "../services/todoCommentService";
import type { GetListTodoCommentsRequestDto } from "../types/getListTodoCommentsRequestDto";
import type { TodoCommentResponseDto } from "../types/todoCommentResponseDto";
import type { PagedResult } from "../../common/types/pagedResult";

type UseGetPagedAndFilterTodoCommentsOptionsType = Omit<
  UseQueryOptions<PagedResult<TodoCommentResponseDto>, Error>,
  "queryKey" | "queryFn"
>;

export const useGetPagedAndFilterTodoComments = (
  todoItemId: string,
  params: GetListTodoCommentsRequestDto,
  options: UseGetPagedAndFilterTodoCommentsOptionsType = {},
) => {
  return useQuery<PagedResult<TodoCommentResponseDto>, Error>({
    queryKey: ["todoComments", "paged", todoItemId, params],
    queryFn: async () => {
      return await getPagedAndFilterTodoCommentsAsync(todoItemId, params);
    },
    enabled: !!todoItemId,
    ...options,
  });
};
