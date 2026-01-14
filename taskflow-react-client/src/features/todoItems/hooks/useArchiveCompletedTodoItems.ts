import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { archiveCompletedTodoItemsAsync } from "../services/todoItemService";

type UseArchiveCompletedTodoItemsOptionsType = Omit<
  UseMutationOptions<void, Error, void>,
  "mutationFn"
>;

export const useArchiveCompletedTodoItems = (
  options: UseArchiveCompletedTodoItemsOptionsType = {},
) => {
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await archiveCompletedTodoItemsAsync();
    },
    ...options,
  });
};
