import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { getPagedAndFilterTodoItemsAsync } from "../services/todoItemService";
import type { GetPagedAndFilterTodoItemsRequestDto } from "../types/getPagedAndFilterTodoItemsRequestDto";
import type { TodoItemResponseDto } from "../types/todoItemResponseDto";
import type { PagedResult } from "../../common/types/pagedResult";

type UseGetPagedAndFilterTodoItemsOptionsType = Omit<
  UseQueryOptions<PagedResult<TodoItemResponseDto>, Error>,
  "queryKey" | "queryFn"
>;

export const useGetPagedAndFilterTodoItems = (
  params: GetPagedAndFilterTodoItemsRequestDto,
  options: UseGetPagedAndFilterTodoItemsOptionsType = {},
) => {
  return useQuery<PagedResult<TodoItemResponseDto>, Error>({
    queryKey: ["todoItems", "paged", params],
    queryFn: async () => {
      return await getPagedAndFilterTodoItemsAsync(params);
    },
    ...options,
  });
};
