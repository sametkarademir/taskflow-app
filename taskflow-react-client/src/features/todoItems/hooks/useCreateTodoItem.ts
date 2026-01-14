import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { createTodoItemAsync } from "../services/todoItemService";
import type { CreateTodoItemRequestDto } from "../types/createTodoItemRequestDto";
import type { TodoItemResponseDto } from "../types/todoItemResponseDto";

type UseCreateTodoItemOptionsType = Omit<
  UseMutationOptions<
    TodoItemResponseDto,
    Error,
    { params: CreateTodoItemRequestDto }
  >,
  "mutationFn"
>;

export const useCreateTodoItem = (
  options: UseCreateTodoItemOptionsType = {},
) => {
  return useMutation<
    TodoItemResponseDto,
    Error,
    { params: CreateTodoItemRequestDto }
  >({
    mutationFn: async ({
      params,
    }: {
      params: CreateTodoItemRequestDto;
    }) => {
      return await createTodoItemAsync(params);
    },
    ...options,
  });
};
