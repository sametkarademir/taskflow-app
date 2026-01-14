import apiClient from "../../common/helpers/axios";

import type { PagedResult } from "../../common/types/pagedResult";

import type { TodoItemResponseDto } from "../types/todoItemResponseDto";
import type { TodoItemColumnDto } from "../types/todoItemColumnDto";
import type { CreateTodoItemRequestDto } from "../types/createTodoItemRequestDto";
import type { UpdateTodoItemRequestDto } from "../types/updateTodoItemRequestDto";
import type { UpdateTodoItemStatusRequestDto } from "../types/updateTodoItemStatusRequestDto";
import type { GetPagedAndFilterTodoItemsRequestDto } from "../types/getPagedAndFilterTodoItemsRequestDto";
import type { GetListTodoItemsRequestDto } from "../types/getListTodoItemsRequestDto";

const todoItemRoute = "/api/v1/todo-items";

export async function getTodoItemByIdAsync(
  id: string,
): Promise<TodoItemResponseDto> {
  const response = await apiClient.get<TodoItemResponseDto>(
    `${todoItemRoute}/${id}`,
  );
  return response.data;
}

export async function getTodoItemListAsync(
  params?: GetListTodoItemsRequestDto,
): Promise<TodoItemColumnDto[]> {
  const response = await apiClient.get<TodoItemColumnDto[]>(
    `${todoItemRoute}/list`,
    { params },
  );
  return response.data;
}

export async function getPagedAndFilterTodoItemsAsync(
  params: GetPagedAndFilterTodoItemsRequestDto,
): Promise<PagedResult<TodoItemResponseDto>> {
  const response = await apiClient.get<PagedResult<TodoItemResponseDto>>(
    `${todoItemRoute}/paged`,
    { params },
  );
  return response.data;
}

export async function createTodoItemAsync(
  data: CreateTodoItemRequestDto,
): Promise<TodoItemResponseDto> {
  const response = await apiClient.post<TodoItemResponseDto>(
    todoItemRoute,
    data,
  );
  return response.data;
}

export async function updateTodoItemAsync(
  id: string,
  data: UpdateTodoItemRequestDto,
): Promise<TodoItemResponseDto> {
  const response = await apiClient.put<TodoItemResponseDto>(
    `${todoItemRoute}/${id}`,
    data,
  );
  return response.data;
}

export async function updateTodoItemStatusAsync(
  id: string,
  data: UpdateTodoItemStatusRequestDto,
): Promise<TodoItemResponseDto> {
  const response = await apiClient.patch<TodoItemResponseDto>(
    `${todoItemRoute}/${id}/status`,
    data,
  );
  return response.data;
}

export async function archiveTodoItemAsync(id: string): Promise<TodoItemResponseDto> {
  const response = await apiClient.patch<TodoItemResponseDto>(
    `${todoItemRoute}/${id}/archive`,
  );
  return response.data;
}

export async function archiveCompletedTodoItemsAsync(): Promise<void> {
  await apiClient.patch(`${todoItemRoute}/archive-completed`);
}

export async function deleteTodoItemAsync(id: string): Promise<void> {
  await apiClient.delete(`${todoItemRoute}/${id}`);
}
