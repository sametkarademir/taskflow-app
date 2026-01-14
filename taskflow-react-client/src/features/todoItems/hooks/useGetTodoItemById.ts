import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { getTodoItemByIdAsync } from "../services/todoItemService";
import type { TodoItemResponseDto } from "../types/todoItemResponseDto";

type UseGetTodoItemByIdOptionsType = Omit<
  UseQueryOptions<TodoItemResponseDto, Error>,
  "queryKey" | "queryFn"
>;

export const useGetTodoItemById = (
  id: string,
  options: UseGetTodoItemByIdOptionsType = {},
) => {
  return useQuery<TodoItemResponseDto, Error>({
    queryKey: ["todoItem", id],
    queryFn: async () => {
      return await getTodoItemByIdAsync(id);
    },
    enabled: !!id,
    ...options,
  });
};
