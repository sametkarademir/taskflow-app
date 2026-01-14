import type { TodoStatus, TodoPriority } from "./todoItemResponseDto";

export interface GetPagedAndFilterTodoItemsRequestDto {
  page: number;
  perPage: number;
  search?: string | null;
  field?: string | null;
  order?: "asc" | "desc" | null;
  isArchived?: boolean | null;
  status?: TodoStatus | null;
  priority?: TodoPriority | null;
  categoryId?: string | null;
}
