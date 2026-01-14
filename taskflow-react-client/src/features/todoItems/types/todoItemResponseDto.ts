import type { CategoryResponseDto } from "../../categories/types/categoryResponseDto";

export type TodoStatus = "Backlog" | "InProgress" | "Blocked" | "Completed";
export type TodoPriority = "Low" | "Medium" | "High";

export interface TodoItemResponseDto {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: string;
  isArchived: boolean;
  archivedTime?: string;
  categoryId: string;
  category?: CategoryResponseDto;
  userId: string;
}
