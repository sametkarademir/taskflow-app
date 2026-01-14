import { Plus, Archive } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useLocale } from "../../common/hooks/useLocale";
import { TodoItemCard } from "./TodoItemCard";
import type { TodoItemResponseDto } from "../types/todoItemResponseDto";

interface TodoItemKanbanColumnProps {
  id: string;
  title: string;
  count: number;
  color: "slate" | "primary" | "emerald" | "orange";
  tasks: TodoItemResponseDto[];
  onAddTask?: () => void;
  onTaskClick?: (taskId: string) => void;
  onArchive?: () => void;
  onArchiveAll?: () => void;
  isDraggingActive?: boolean;
}

export const TodoItemKanbanColumn = ({
  id,
  title,
  count,
  color,
  tasks,
  onAddTask,
  onTaskClick,
  onArchive,
  onArchiveAll,
  isDraggingActive = false,
}: TodoItemKanbanColumnProps) => {
  const { t } = useLocale();
  const { setNodeRef, isOver } = useDroppable({
    id,
  });
  
  const dropZoneId = `${id}-dropzone-top`;
  const { setNodeRef: setDropZoneRef, isOver: isOverDropZone } = useDroppable({
    id: dropZoneId,
  });

  const isCompletedColumn = id === "Completed";

  const colorClasses = {
    slate: "bg-slate-500",
    primary: "bg-[#6366f1] animate-pulse",
    emerald: "bg-emerald-500",
    orange: "bg-orange-500",
  };

  const countBadgeClasses = {
    slate: "bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-medium",
    primary: "bg-[#6366f1] text-white text-xs font-bold",
    emerald: "bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-medium",
    orange: "bg-orange-500/20 border border-orange-500/50 text-orange-400 text-xs font-medium",
  };

  const taskIds = tasks.map((task) => task.id);

  return (
    <div
      className={`flex flex-col w-80 h-full bg-zinc-950/50 rounded-xl border ${
        isOver ? "border-[#6366f1] border-2" : "border-zinc-800/50"
      } transition-colors`}
    >
      {/* Column Header */}
      <div className="p-4 flex items-center justify-between border-b border-zinc-800 sticky top-0 bg-inherit rounded-t-xl z-10">
        <div className="flex items-center gap-2">
          <div className={`size-2.5 rounded-full ${colorClasses[color]}`} />
          <h3 className="font-bold text-white text-sm tracking-wide">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {isCompletedColumn && onArchiveAll && count > 0 && (
            <button
              onClick={onArchiveAll}
              className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition-colors"
              title={t("pages.todoItems.actions.archiveAll")}
            >
              <Archive className="w-3.5 h-3.5" />
            </button>
          )}
          <span
            className={`ml-1 ${countBadgeClasses[color]} px-2 py-0.5 rounded-full`}
          >
            {count}
          </span>
        </div>
      </div>

      {/* Column Content */}
      <div
        ref={setNodeRef}
        className="p-3 flex flex-col gap-3 overflow-y-auto kanban-scroll flex-1"
      >
        {/* Drop Zone - Top */}
        {isDraggingActive && (
          <div
            ref={setDropZoneRef}
            className={`min-h-[60px] rounded-lg border-2 border-dashed transition-all duration-200 mb-1 relative z-20 pointer-events-auto ${
              isOverDropZone
                ? "border-[#6366f1] bg-[#6366f1]/10 scale-[1.02] shadow-lg shadow-[#6366f1]/20"
                : "border-zinc-700/50 bg-zinc-900/20"
            }`}
          >
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-1 rounded-full transition-colors ${
                    isOverDropZone ? "bg-[#6366f1]" : "bg-zinc-600"
                  }`}
                />
                <span
                  className={`text-xs font-medium transition-colors ${
                    isOverDropZone ? "text-[#6366f1]" : "text-zinc-500"
                  }`}
                >
                  {isOverDropZone ? t("pages.todoItems.dropZone.dropHere") : t("pages.todoItems.dropZone.dropZone")}
                </span>
              </div>
            </div>
          </div>
        )}
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <div key={task.id} className={isDraggingActive ? "relative z-0" : ""}>
              <TodoItemCard
                task={task}
                isDraggingActive={isDraggingActive}
                onClick={() => onTaskClick?.(task.id)}
                onArchive={onArchive}
              />
            </div>
          ))}
        </SortableContext>
        {onAddTask && (
          <button
            onClick={onAddTask}
            className="flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-zinc-800 text-zinc-400 hover:text-white hover:border-[#6366f1]/50 hover:bg-[#6366f1]/5 transition-all text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>{t("pages.todoItems.actions.addTask")}</span>
          </button>
        )}
      </div>
    </div>
  );
};
