import { Calendar, Edit, Archive } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useLocale } from "../../common/hooks/useLocale";
import { useArchiveTodoItem } from "../hooks/useArchiveTodoItem";
import { showToast } from "../../common/helpers/toaster";

import type { TodoItemResponseDto } from "../types/todoItemResponseDto";
import { PriorityBadge } from "./PriorityBadge";
import { Divider } from "../../../components/ui/divider";

interface TodoItemCardProps {
  task: TodoItemResponseDto;
  isDraggingActive?: boolean;
  onClick?: () => void;
  onArchive?: () => void;
}

export const TodoItemCard = ({
  task,
  isDraggingActive = false,
  onClick,
  onArchive,
}: TodoItemCardProps) => {
  const { t } = useLocale();
  const { mutate: archiveTodoItem, isPending: isArchiving } = useArchiveTodoItem({
    onSuccess: () => {
      showToast(t("pages.todoItems.messages.archiveSuccess"), "success");
      onArchive?.();
    },
  });
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isDisabled = isDraggingActive && !isDragging;

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString(t("locale"), { month: "short", day: "numeric" });
  };

  const getDueDateColor = (dateString?: string): string => {
    if (!dateString) return "text-zinc-400";
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      return "text-red-400";
    } else if (dueDate.getTime() === today.getTime()) {
      return "text-orange-400";
    } else {
      return "text-green-400";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative bg-zinc-900 hover:bg-[#1f1f22] p-4 rounded-lg border border-zinc-800 shadow-sm cursor-grab active:cursor-grabbing group transition-all duration-200 ${isDisabled
        ? "opacity-40 grayscale pointer-events-none cursor-not-allowed"
        : ""
        }`}
    >
      {task.category?.colorHex && (
        <div
          className="absolute left-0 top-4 bottom-4 w-1 rounded-r"
          style={{
            backgroundColor: task.category.colorHex,
          }}
        />
      )}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {task.category && (
            <span
              className="text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border"
              style={{
                backgroundColor: `${task.category.colorHex || "#6366f1"}20`,
                color: task.category.colorHex || "#6366f1",
                borderColor: `${task.category.colorHex || "#6366f1"}40`,
              }}
            >
              {task.category.name}
            </span>
          )}
          <PriorityBadge priority={task.priority} />
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="text-zinc-400 hover:text-orange-400 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              archiveTodoItem(task.id);
            }}
            disabled={isArchiving}
          >
            <Archive className="w-4 h-4" />
          </button>
          <button
            className="text-zinc-400 hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>
      <h4
        className="text-white text-sm font-semibold mb-3 mt-3 leading-snug"
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
      >
        {task.title}
      </h4>

      {task.description && (
        <p className="text-zinc-400 text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <Divider />
      <div className="flex items-center justify-between">
        {task.dueDate && (
          <div className={`flex items-center gap-1.5 text-xs ${getDueDateColor(task.dueDate)}`}>
            <Calendar className="w-3 h-3" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
