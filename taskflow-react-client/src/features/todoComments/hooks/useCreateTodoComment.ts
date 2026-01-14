import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { createTodoCommentAsync } from "../services/todoCommentService";
import type { CreateTodoCommentRequestDto } from "../types/createTodoCommentRequestDto";
import type { TodoCommentResponseDto } from "../types/todoCommentResponseDto";

type UseCreateTodoCommentOptionsType = Omit<
  UseMutationOptions<
    TodoCommentResponseDto,
    Error,
    { todoItemId: string; params: CreateTodoCommentRequestDto }
  >,
  "mutationFn"
>;

export const useCreateTodoComment = (
  options: UseCreateTodoCommentOptionsType = {},
) => {
  return useMutation<
    TodoCommentResponseDto,
    Error,
    { todoItemId: string; params: CreateTodoCommentRequestDto }
  >({
    mutationFn: async ({
      todoItemId,
      params,
    }: {
      todoItemId: string;
      params: CreateTodoCommentRequestDto;
    }) => {
      return await createTodoCommentAsync(todoItemId, params);
    },
    ...options,
  });
};
