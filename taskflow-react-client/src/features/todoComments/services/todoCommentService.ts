import apiClient from "../../common/helpers/axios";

import type { PagedResult } from "../../common/types/pagedResult";

import type { TodoCommentResponseDto } from "../types/todoCommentResponseDto";
import type { CreateTodoCommentRequestDto } from "../types/createTodoCommentRequestDto";
import type { GetListTodoCommentsRequestDto } from "../types/getListTodoCommentsRequestDto";

export async function getPagedAndFilterTodoCommentsAsync(
  todoItemId: string,
  params: GetListTodoCommentsRequestDto,
): Promise<PagedResult<TodoCommentResponseDto>> {
  const response = await apiClient.get<PagedResult<TodoCommentResponseDto>>(
    `/api/v1/todo-items/${todoItemId}/comments/paged`,
    { params },
  );
  return response.data;
}

export async function createTodoCommentAsync(
  todoItemId: string,
  data: CreateTodoCommentRequestDto,
): Promise<TodoCommentResponseDto> {
  const response = await apiClient.post<TodoCommentResponseDto>(
    `/api/v1/todo-items/${todoItemId}/comments`,
    data,
  );
  return response.data;
}
