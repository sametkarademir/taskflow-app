import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { updateTodoItemAsync } from "../services/todoItemService";
import type { UpdateTodoItemRequestDto } from "../types/updateTodoItemRequestDto";
import type { TodoItemResponseDto } from "../types/todoItemResponseDto";

type UseUpdateTodoItemOptionsType = Omit<
  UseMutationOptions<
    TodoItemResponseDto,
    Error,
    { id: string; data: UpdateTodoItemRequestDto }
  >,
  "mutationFn"
>;

export const useUpdateTodoItem = (
  options: UseUpdateTodoItemOptionsType = {},
) => {
  return useMutation<
    TodoItemResponseDto,
    Error,
    { id: string; data: UpdateTodoItemRequestDto }
  >({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateTodoItemRequestDto;
    }) => {
      return await updateTodoItemAsync(id, data);
    },
    ...options,
  });
};
