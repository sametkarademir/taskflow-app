import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { deleteTodoItemAsync } from "../services/todoItemService";

type UseDeleteTodoItemOptionsType = Omit<
  UseMutationOptions<void, Error, string>,
  "mutationFn"
>;

export const useDeleteTodoItem = (
  options: UseDeleteTodoItemOptionsType = {},
) => {
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await deleteTodoItemAsync(id);
    },
    ...options,
  });
};
