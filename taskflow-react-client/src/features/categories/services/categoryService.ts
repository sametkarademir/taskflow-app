import apiClient from "../../common/helpers/axios";

import type { PagedResult } from "../../common/types/pagedResult";

import type { CategoryResponseDto } from "../types/categoryResponseDto";
import type { CreateCategoryRequestDto } from "../types/createCategoryRequestDto";
import type { UpdateCategoryRequestDto } from "../types/updateCategoryRequestDto";
import type { GetListCategoriesRequestDto } from "../types/getListCategoriesRequestDto";

const categoryRoute = "/api/v1/categories";

export async function getCategoryByIdAsync(
  id: string,
): Promise<CategoryResponseDto> {
  const response = await apiClient.get<CategoryResponseDto>(
    `${categoryRoute}/${id}`,
  );
  return response.data;
}

export async function getPagedAndFilterCategoriesAsync(
  params: GetListCategoriesRequestDto,
): Promise<PagedResult<CategoryResponseDto>> {
  const response = await apiClient.get<PagedResult<CategoryResponseDto>>(
    `${categoryRoute}/paged`,
    { params },
  );
  return response.data;
}

export async function createCategoryAsync(
  data: CreateCategoryRequestDto,
): Promise<CategoryResponseDto> {
  const response = await apiClient.post<CategoryResponseDto>(
    categoryRoute,
    data,
  );
  return response.data;
}

export async function updateCategoryAsync(
  id: string,
  data: UpdateCategoryRequestDto,
): Promise<CategoryResponseDto> {
  const response = await apiClient.put<CategoryResponseDto>(
    `${categoryRoute}/${id}`,
    data,
  );
  return response.data;
}

export async function deleteCategoryAsync(id: string): Promise<void> {
  await apiClient.delete(`${categoryRoute}/${id}`);
}
