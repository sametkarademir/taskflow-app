import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { updateTodoItemStatusAsync } from "../services/todoItemService";
import type { UpdateTodoItemStatusRequestDto } from "../types/updateTodoItemStatusRequestDto";
import type { TodoItemResponseDto } from "../types/todoItemResponseDto";

type UseUpdateTodoItemStatusOptionsType = Omit<
  UseMutationOptions<
    TodoItemResponseDto,
    Error,
    { id: string; data: UpdateTodoItemStatusRequestDto }
  >,
  "mutationFn"
>;

export const useUpdateTodoItemStatus = (
  options: UseUpdateTodoItemStatusOptionsType = {},
) => {
  return useMutation<
    TodoItemResponseDto,
    Error,
    { id: string; data: UpdateTodoItemStatusRequestDto }
  >({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateTodoItemStatusRequestDto;
    }) => {
      return await updateTodoItemStatusAsync(id, data);
    },
    ...options,
  });
};
