import { List, LayoutGrid } from "lucide-react";

import { useLocale } from "../../../features/common/hooks/useLocale";
import { useGetPagedAndFilterCategories } from "../../categories/hooks/useGetPagedAndFilterCategories";

import { Select, type SelectOption } from "../../../components/form/select";

interface FiltersToolbarProps {
  statusFilter?: string;
  priorityFilter?: string;
  categoryFilter?: string;
  onStatusFilterChange?: (value: string) => void;
  onPriorityFilterChange?: (value: string) => void;
  onCategoryFilterChange?: (value: string) => void;
  onViewToggle?: (view: "kanban" | "list") => void;
  currentView?: "kanban" | "list";
}

export const FiltersToolbar = ({
  statusFilter = "",
  priorityFilter = "",
  categoryFilter = "",
  onStatusFilterChange,
  onPriorityFilterChange,
  onCategoryFilterChange,
  onViewToggle,
  currentView = "kanban",
}: FiltersToolbarProps) => {
  const { t } = useLocale();

  const { data: categoriesData } = useGetPagedAndFilterCategories(
    { page: 1, perPage: 100 },
    { enabled: true }
  );

  const statusOptions: SelectOption[] = [
    { value: "", label: t("pages.todoItems.filters.all") },
    { value: "Backlog", label: t("pages.todoItems.columns.backlog") },
    { value: "InProgress", label: t("pages.todoItems.columns.inProgress") },
    { value: "Blocked", label: t("pages.todoItems.columns.blocked") },
    { value: "Completed", label: t("pages.todoItems.columns.completed") },
  ];

  const priorityOptions: SelectOption[] = [
    { value: "", label: t("pages.todoItems.filters.all") },
    { value: "Low", label: t("pages.todoItems.priority.low") },
    { value: "Medium", label: t("pages.todoItems.priority.medium") },
    { value: "High", label: t("pages.todoItems.priority.high") },
  ];

  const categoryOptions: SelectOption[] = [
    { value: "", label: t("pages.todoItems.filters.all") },
    ...(categoriesData?.data?.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })) || []),
  ];

  return (
    <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0 border-b border-zinc-800">
      <div className="flex items-center gap-3">
        <div className="w-[180px]">
          <Select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange?.(e.target.value)}
            options={statusOptions}
            className="text-sm"
          />
        </div>
        <div className="w-[180px]">
          <Select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange?.(e.target.value)}
            options={priorityOptions}
            className="text-sm"
          />
        </div>
        <div className="w-[180px]">
          <Select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange?.(e.target.value)}
            options={categoryOptions}
            className="text-sm"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex bg-zinc-900 rounded-lg p-0.5 border border-zinc-800">
          <button
            onClick={() => onViewToggle?.("kanban")}
            className={`p-1.5 rounded transition-colors ${
              currentView === "kanban"
                ? "bg-[#6366f1]/20 text-[#6366f1]"
                : "text-zinc-400 hover:text-white"
            }`}
            title="Kanban View"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewToggle?.("list")}
            className={`p-1.5 rounded transition-colors ${
              currentView === "list"
                ? "bg-[#6366f1]/20 text-[#6366f1]"
                : "text-zinc-400 hover:text-white"
            }`}
            title="List View"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
