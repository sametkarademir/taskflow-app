import type { TodoStatus, TodoPriority } from "./todoItemResponseDto";

export interface GetListTodoItemsRequestDto {
  status?: TodoStatus | string | null;
  priority?: TodoPriority | string | null;
  categoryId?: string | null;
}
