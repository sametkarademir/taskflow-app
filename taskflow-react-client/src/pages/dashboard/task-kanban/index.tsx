import { useState } from "react";

import { FiltersToolbar } from "../../../features/todoItems/components/FiltersToolbar";
import { TaskKanbanView } from "../../../features/todoItems/components/TaskKanbanView";
import { TaskListView } from "../../../features/todoItems/components/TaskListView";

export const TaskPage = () => {
  const [currentView, setCurrentView] = useState<"kanban" | "list">("kanban");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const filters = {
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
    categoryId: categoryFilter || undefined,
  };

  const handleRefetch = () => {
    // This can be used to trigger refetch in both views if needed
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-zinc-950">
      <FiltersToolbar
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        categoryFilter={categoryFilter}
        onStatusFilterChange={setStatusFilter}
        onPriorityFilterChange={setPriorityFilter}
        onCategoryFilterChange={setCategoryFilter}
        onViewToggle={setCurrentView}
        currentView={currentView}
      />
      {currentView === "kanban" ? (
        <TaskKanbanView filters={filters} onRefetch={handleRefetch} />
      ) : (
        <TaskListView filters={filters} onRefetch={handleRefetch} />
      )}
    </div>
  );
};
