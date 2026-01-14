import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

import { useLocale } from "../../../features/common/hooks/useLocale";
import { useGetTodoItemList } from "../../../features/todoItems/hooks/useGetTodoItemList";
import { useUpdateTodoItemStatus } from "../../../features/todoItems/hooks/useUpdateTodoItemStatus";
import { useArchiveCompletedTodoItems } from "../../../features/todoItems/hooks/useArchiveCompletedTodoItems";
import { showToast } from "../../../features/common/helpers/toaster";

import type { TodoStatus } from "../../../features/todoItems/types/todoItemResponseDto";
import { TodoItemKanbanColumn } from "./TodoItemKanbanColumn";
import { CreateTodoItemDrawer } from "./CreateTodoItemDrawer";
import { UpdateTodoItemDrawer } from "./UpdateTodoItemDrawer";
import { columnIdToStatus, columnColors, columnTitleToI18nKey } from "../constants/kanbanColumns";
import type { TodoItemResponseDto } from "../types/todoItemResponseDto";
import type { GetListTodoItemsRequestDto } from "../types/getListTodoItemsRequestDto";

interface TaskKanbanViewProps {
  filters: GetListTodoItemsRequestDto;
  onRefetch?: () => void;
}

export const TaskKanbanView = ({ filters, onRefetch }: TaskKanbanViewProps) => {
  const { t } = useLocale();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState(false);
  const [selectedTodoItemId, setSelectedTodoItemId] = useState<string | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TodoStatus>("Backlog");

  const { data: columnsData, isLoading, refetch } = useGetTodoItemList(filters);

  const { mutate: updateStatus } = useUpdateTodoItemStatus({
    onSuccess: () => {
      refetch();
      onRefetch?.();
    },
  });

  const { mutate: archiveCompleted } = useArchiveCompletedTodoItems({
    onSuccess: () => {
      showToast(t("pages.todoItems.messages.archiveAllSuccess"), "success");
      refetch();
      onRefetch?.();
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const findTask = (
    taskId: string
  ): { task: TodoItemResponseDto; status: TodoStatus } | null => {
    if (!columnsData) return null;
    for (const column of columnsData) {
      const task = column.items.find((t) => t.id === taskId);
      if (task) {
        const status = columnIdToStatus[column.title];
        return { task, status };
      }
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = findTask(activeId);
    if (!activeTask) return;

    // If dropped on drop zone (top of column)
    if (overId.endsWith("-dropzone-top")) {
      const columnTitle = overId.replace("-dropzone-top", "");
      if (Object.keys(columnIdToStatus).includes(columnTitle)) {
        const newStatus = columnIdToStatus[columnTitle];
        if (activeTask.status === newStatus) return;

        updateStatus({
          id: activeId,
          data: { status: newStatus },
        });
        return;
      }
    }

    // If dropped on a column
    if (Object.keys(columnIdToStatus).includes(overId)) {
      const newStatus = columnIdToStatus[overId];
      if (activeTask.status === newStatus) return;

      updateStatus({
        id: activeId,
        data: { status: newStatus },
      });
      return;
    }

    // If dropped on another task
    const overTask = findTask(overId);
    if (!overTask) return;

    if (activeTask.status === overTask.status) {
      // Same column, just reorder (no API call needed for now)
      return;
    } else {
      // Move to different column
      updateStatus({
        id: activeId,
        data: { status: overTask.status },
      });
    }
  };

  const activeTask = activeId ? findTask(activeId)?.task : null;

  const handleAddTask = (status: TodoStatus) => {
    setDefaultStatus(status);
    setIsCreateDrawerOpen(true);
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTodoItemId(taskId);
    setIsUpdateDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full blur opacity-20 animate-pulse"></div>
          <div className="relative animate-spin rounded-full h-12 w-12 border-2 border-[#6366f1] border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden mt-3 px-6 pb-6">
          <div className="h-full flex gap-6 min-w-full w-max">
            {columnsData?.map((column) => (
              <TodoItemKanbanColumn
                key={column.title}
                id={column.title}
                title={t(columnTitleToI18nKey[column.title] || column.title)}
                count={column.taskCount}
                color={columnColors[column.title]}
                tasks={column.items}
                onAddTask={() => handleAddTask(columnIdToStatus[column.title])}
                onTaskClick={handleTaskClick}
                onArchive={() => {
                  refetch();
                  onRefetch?.();
                }}
                onArchiveAll={
                  column.title === "Completed"
                    ? () => archiveCompleted()
                    : undefined
                }
                isDraggingActive={!!activeId}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 shadow-lg opacity-95 rotate-2 w-80">
              <div className="text-white text-sm font-semibold">{activeTask.title}</div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Create Drawer */}
      <CreateTodoItemDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onSuccess={() => {
          refetch();
          onRefetch?.();
        }}
        defaultStatus={defaultStatus}
      />

      {/* Update Drawer */}
      <UpdateTodoItemDrawer
        isOpen={isUpdateDrawerOpen}
        onClose={() => {
          setIsUpdateDrawerOpen(false);
          setSelectedTodoItemId(null);
        }}
        onSuccess={() => {
          refetch();
          onRefetch?.();
        }}
        todoItemId={selectedTodoItemId}
      />

      <style>{`
        .kanban-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .kanban-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .kanban-scroll::-webkit-scrollbar-thumb {
          background-color: #3f3f46;
          border-radius: 20px;
        }
        .kanban-scroll::-webkit-scrollbar-thumb:hover {
          background-color: #52525b;
        }
      `}</style>
    </>
  );
};
