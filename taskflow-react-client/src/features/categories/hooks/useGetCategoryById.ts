import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { getCategoryByIdAsync } from "../services/categoryService";
import type { CategoryResponseDto } from "../types/categoryResponseDto";

type UseGetCategoryByIdOptionsType = Omit<
  UseQueryOptions<CategoryResponseDto, Error>,
  "queryKey" | "queryFn"
>;

export const useGetCategoryById = (
  id: string,
  options: UseGetCategoryByIdOptionsType = {},
) => {
  return useQuery<CategoryResponseDto, Error>({
    queryKey: ["category", id],
    queryFn: async () => {
      return await getCategoryByIdAsync(id);
    },
    enabled: !!id,
    ...options,
  });
};
