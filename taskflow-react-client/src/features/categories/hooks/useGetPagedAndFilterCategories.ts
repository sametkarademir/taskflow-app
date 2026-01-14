import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { getPagedAndFilterCategoriesAsync } from "../services/categoryService";
import type { GetListCategoriesRequestDto } from "../types/getListCategoriesRequestDto";
import type { CategoryResponseDto } from "../types/categoryResponseDto";
import type { PagedResult } from "../../common/types/pagedResult";

type UseGetPagedAndFilterCategoriesOptionsType = Omit<
  UseQueryOptions<PagedResult<CategoryResponseDto>, Error>,
  "queryKey" | "queryFn"
>;

export const useGetPagedAndFilterCategories = (
  params: GetListCategoriesRequestDto,
  options: UseGetPagedAndFilterCategoriesOptionsType = {},
) => {
  return useQuery<PagedResult<CategoryResponseDto>, Error>({
    queryKey: ["categories", "paged", params],
    queryFn: async () => {
      return await getPagedAndFilterCategoriesAsync(params);
    },
    ...options,
  });
};
