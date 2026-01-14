import type { TodoItemResponseDto } from "./todoItemResponseDto";

export interface TodoItemColumnDto {
  title: string;
  taskCount: number;
  items: TodoItemResponseDto[];
}
