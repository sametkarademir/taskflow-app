import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { archiveTodoItemAsync } from "../services/todoItemService";
import type { TodoItemResponseDto } from "../types/todoItemResponseDto";

type UseArchiveTodoItemOptionsType = Omit<
  UseMutationOptions<TodoItemResponseDto, Error, string>,
  "mutationFn"
>;

export const useArchiveTodoItem = (
  options: UseArchiveTodoItemOptionsType = {},
) => {
  return useMutation<TodoItemResponseDto, Error, string>({
    mutationFn: async (id: string) => {
      return await archiveTodoItemAsync(id);
    },
    ...options,
  });
};
