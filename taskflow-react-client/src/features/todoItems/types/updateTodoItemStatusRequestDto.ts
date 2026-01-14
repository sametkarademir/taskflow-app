import type { TodoStatus } from "./todoItemResponseDto";

export interface UpdateTodoItemStatusRequestDto {
  status: TodoStatus;
}
