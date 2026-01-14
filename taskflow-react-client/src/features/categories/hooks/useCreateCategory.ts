import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { createCategoryAsync } from "../services/categoryService";
import type { CreateCategoryRequestDto } from "../types/createCategoryRequestDto";
import type { CategoryResponseDto } from "../types/categoryResponseDto";

type UseCreateCategoryOptionsType = Omit<
  UseMutationOptions<
    CategoryResponseDto,
    Error,
    { params: CreateCategoryRequestDto }
  >,
  "mutationFn"
>;

export const useCreateCategory = (
  options: UseCreateCategoryOptionsType = {},
) => {
  return useMutation<
    CategoryResponseDto,
    Error,
    { params: CreateCategoryRequestDto }
  >({
    mutationFn: async ({
      params,
    }: {
      params: CreateCategoryRequestDto;
    }) => {
      return await createCategoryAsync(params);
    },
    ...options,
  });
};
