import type { TodoStatus, TodoPriority } from "./todoItemResponseDto";

export interface CreateTodoItemRequestDto {
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: string;
  categoryId: string;
}
