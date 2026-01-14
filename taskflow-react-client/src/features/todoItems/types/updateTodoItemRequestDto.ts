import type { TodoPriority, TodoStatus } from "./todoItemResponseDto";

export interface UpdateTodoItemRequestDto {
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: string;
  categoryId: string;
}
