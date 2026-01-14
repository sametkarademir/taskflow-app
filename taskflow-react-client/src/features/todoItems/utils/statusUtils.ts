import type { TodoStatus } from "../types/todoItemResponseDto";

export const getStatusLabel = (
  status: TodoStatus | string,
  t?: (key: string) => string,
): string => {
  if (t) {
    const statusMap: Record<string, string> = {
      Backlog: t("pages.todoItems.columns.backlog"),
      InProgress: t("pages.todoItems.columns.inProgress"),
      Blocked: t("pages.todoItems.columns.blocked"),
      Completed: t("pages.todoItems.columns.completed"),
    };
    return statusMap[status] || status;
  }
  const statusMap: Record<string, string> = {
    Backlog: "Backlog",
    InProgress: "In Progress",
    Blocked: "Blocked",
    Completed: "Completed",
  };
  return statusMap[status] || status;
};

export const getStatusBadgeVariant = (
  status: TodoStatus | string,
): "default" | "emerald" | "rose" | "orange" | "blue" | "purple" => {
  const variantMap: Record<string, "default" | "emerald" | "rose" | "orange" | "blue" | "purple"> = {
    Backlog: "default",
    InProgress: "blue",
    Blocked: "rose",
    Completed: "emerald",
  };
  return variantMap[status] || "default";
};
