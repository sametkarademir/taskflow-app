import type { TodoStatus } from "../types/todoItemResponseDto";

// Backend'den gelen column title'ları (backend her zaman İngilizce gönderiyor)
export const columnIdToStatus: Record<string, TodoStatus> = {
  Backlog: "Backlog",
  "In Progress": "InProgress",
  Blocked: "Blocked",
  Completed: "Completed",
};

export const columnColors: Record<
  string,
  "slate" | "primary" | "emerald" | "orange"
> = {
  Backlog: "slate",
  "In Progress": "primary",
  Blocked: "orange",
  Completed: "emerald",
};

// Backend title'ını i18n key'e çeviren mapping
export const columnTitleToI18nKey: Record<string, string> = {
  Backlog: "pages.todoItems.columns.backlog",
  "In Progress": "pages.todoItems.columns.inProgress",
  Blocked: "pages.todoItems.columns.blocked",
  Completed: "pages.todoItems.columns.completed",
};
