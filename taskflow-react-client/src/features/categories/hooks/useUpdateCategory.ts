import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { updateCategoryAsync } from "../services/categoryService";
import type { UpdateCategoryRequestDto } from "../types/updateCategoryRequestDto";
import type { CategoryResponseDto } from "../types/categoryResponseDto";

type UseUpdateCategoryOptionsType = Omit<
  UseMutationOptions<
    CategoryResponseDto,
    Error,
    { id: string; data: UpdateCategoryRequestDto }
  >,
  "mutationFn"
>;

export const useUpdateCategory = (
  options: UseUpdateCategoryOptionsType = {},
) => {
  return useMutation<
    CategoryResponseDto,
    Error,
    { id: string; data: UpdateCategoryRequestDto }
  >({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCategoryRequestDto;
    }) => {
      return await updateCategoryAsync(id, data);
    },
    ...options,
  });
};
