import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { getTodoItemListAsync } from "../services/todoItemService";
import type { TodoItemColumnDto } from "../types/todoItemColumnDto";
import type { GetListTodoItemsRequestDto } from "../types/getListTodoItemsRequestDto";

type UseGetTodoItemListOptionsType = Omit<
  UseQueryOptions<TodoItemColumnDto[], Error>,
  "queryKey" | "queryFn"
>;

export const useGetTodoItemList = (
  params?: GetListTodoItemsRequestDto,
  options: UseGetTodoItemListOptionsType = {},
) => {
  return useQuery<TodoItemColumnDto[], Error>({
    queryKey: ["todoItems", "list", params],
    queryFn: async () => {
      return await getTodoItemListAsync(params);
    },
    ...options,
  });
};
