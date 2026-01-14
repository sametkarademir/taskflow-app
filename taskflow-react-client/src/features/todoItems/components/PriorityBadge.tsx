import { useLocale } from "../../common/hooks/useLocale";
import type { TodoPriority } from "../types/todoItemResponseDto";

interface PriorityBadgeProps {
  priority: TodoPriority;
}

const priorityToI18nKey: Record<TodoPriority, string> = {
  High: "pages.todoItems.priority.high",
  Medium: "pages.todoItems.priority.medium",
  Low: "pages.todoItems.priority.low",
};

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const { t } = useLocale();
  const variants = {
    High: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  return (
    <span
      className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border ${variants[priority]}`}
    >
      {t(priorityToI18nKey[priority])}
    </span>
  );
};
