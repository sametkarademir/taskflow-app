import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { deleteCategoryAsync } from "../services/categoryService";

type UseDeleteCategoryOptionsType = Omit<
  UseMutationOptions<void, Error, string>,
  "mutationFn"
>;

export const useDeleteCategory = (
  options: UseDeleteCategoryOptionsType = {},
) => {
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await deleteCategoryAsync(id);
    },
    ...options,
  });
};
