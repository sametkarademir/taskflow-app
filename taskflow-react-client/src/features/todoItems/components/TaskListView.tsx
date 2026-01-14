import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { Edit2, Search, Plus, Calendar } from "lucide-react";

import { useLocale } from "../../../features/common/hooks/useLocale";
import { useGetPagedAndFilterTodoItems } from "../hooks/useGetPagedAndFilterTodoItems";
import type { GetPagedAndFilterTodoItemsRequestDto } from "../types/getPagedAndFilterTodoItemsRequestDto";
import type { TodoItemResponseDto, TodoPriority, TodoStatus } from "../types/todoItemResponseDto";

import { DataTable, type TableColumn, type PaginationMeta } from "../../../components/ui/table";
import { Input } from "../../../components/form/input";
import { Button } from "../../../components/form/button";
import { Badge } from "../../../components/ui/badge";
import { FilterTabs } from "../../../components/ui/filter-tabs";
import { CreateTodoItemDrawer } from "./CreateTodoItemDrawer";
import { UpdateTodoItemDrawer } from "./UpdateTodoItemDrawer";

interface TaskListViewProps {
  filters: {
    status?: string | null;
    priority?: string | null;
    categoryId?: string | null;
  };
  onRefetch?: () => void;
}

export const TaskListView = ({ filters, onRefetch }: TaskListViewProps) => {
  const { t, locale } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [debouncedSearch] = useDebounce(searchTerm, 600);
  const [archiveFilter, setArchiveFilter] = useState<"all" | "archived" | "active">(
    (searchParams.get("isArchived") as "all" | "archived" | "active") || "all",
  );
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState(false);
  const [selectedTodoItemId, setSelectedTodoItemId] = useState<string | null>(null);

  const params = useMemo(
    () => ({
      page: Number(searchParams.get("page")) || 1,
      perPage: Number(searchParams.get("perPage")) || 10,
      search: debouncedSearch || undefined,
      field: searchParams.get("field") || "creationTime",
      order: (searchParams.get("order") as "asc" | "desc") || "desc",
      isArchived:
        archiveFilter === "all"
          ? null
          : archiveFilter === "archived"
            ? true
            : false,
      status: (filters.status as TodoStatus | undefined) || undefined,
      priority: (filters.priority as TodoPriority | undefined) || undefined,
      categoryId: filters.categoryId || undefined,
    }),
    [searchParams, debouncedSearch, archiveFilter, filters],
  );

  const { data: todoItemsData, isLoading, refetch } = useGetPagedAndFilterTodoItems(params);

  const updateParams = useCallback((newParams: Partial<GetPagedAndFilterTodoItemsRequestDto>) => {
    const updatedParams = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        updatedParams.set(key, value.toString());
      } else {
        updatedParams.delete(key);
      }
    });

    setSearchParams(updatedParams);
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    updateParams({ search: debouncedSearch, page: 1 });
  }, [debouncedSearch, updateParams]);

  const handleArchiveFilterChange = (filter: "all" | "archived" | "active") => {
    setArchiveFilter(filter);
    const isArchivedParam =
      filter === "all" ? null : filter === "archived" ? true : false;
    updateParams({ isArchived: isArchivedParam, page: 1 });
  };

  const handleEdit = (todoItemId: string) => {
    setSelectedTodoItemId(todoItemId);
    setIsUpdateDrawerOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
      month: "short",
      day: "numeric",
    });
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

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "emerald" | "blue" | "orange" | "default" }> = {
      Backlog: { label: t("pages.todoItems.columns.backlog"), variant: "default" },
      InProgress: { label: t("pages.todoItems.columns.inProgress"), variant: "blue" },
      Blocked: { label: t("pages.todoItems.columns.blocked"), variant: "orange" },
      Completed: { label: t("pages.todoItems.columns.completed"), variant: "emerald" },
    };
    const statusInfo = statusMap[status] || { label: status, variant: "default" as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap: Record<string, { label: string; className: string }> = {
      Low: { label: t("pages.todoItems.priority.low"), className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      Medium: { label: t("pages.todoItems.priority.medium"), className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
      High: { label: t("pages.todoItems.priority.high"), className: "bg-red-500/20 text-red-400 border-red-500/30" },
    };
    const priorityInfo = priorityMap[priority] || { label: priority, className: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30" };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${priorityInfo.className}`}>
        {priorityInfo.label}
      </span>
    );
  };

  const columns: TableColumn<TodoItemResponseDto>[] = [
    {
      title: t("pages.todoItems.table.title"),
      dataIndex: "title",
      sortable: true,
      width: "25%",
      render: (value: string, record: TodoItemResponseDto) => (
        <div className="flex flex-col gap-1">
          <p className="font-medium text-zinc-200">{value}</p>
          {record.description && (
            <p className="text-xs text-zinc-500 line-clamp-1">{record.description}</p>
          )}
        </div>
      ),
    },
    {
      title: t("pages.todoItems.table.status"),
      dataIndex: "status",
      sortable: true,
      width: "12%",
      align: "center",
      render: (value: string) => getStatusBadge(value),
    },
    {
      title: t("pages.todoItems.table.priority"),
      dataIndex: "priority",
      sortable: true,
      width: "12%",
      align: "center",
      render: (value: string) => getPriorityBadge(value),
    },
    {
      title: t("pages.todoItems.table.category"),
      dataIndex: "category",
      sortable: false,
      width: "15%",
      render: (_: unknown, record: TodoItemResponseDto) => (
        <div className="flex items-center gap-2">
          {record.category?.colorHex && (
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: record.category.colorHex }}
            />
          )}
          <span className="text-zinc-400">{record.category?.name || "-"}</span>
        </div>
      ),
    },
    {
      title: t("pages.todoItems.table.dueDate"),
      dataIndex: "dueDate",
      sortable: true,
      width: "15%",
      render: (value?: string) => {
        const formattedDate = formatDate(value);
        if (!formattedDate) return "-";
        return (
          <div className={`flex items-center gap-1.5 text-xs ${getDueDateColor(value)}`}>
            <Calendar className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
        );
      },
    },
    {
      title: t("pages.todoItems.table.actions"),
      dataIndex: "actions" as keyof TodoItemResponseDto,
      width: "10%",
      align: "right",
      render: (_: unknown, record: TodoItemResponseDto) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleEdit(record.id)}
            className="p-2 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800/50 transition-all duration-200"
            title={t("pages.todoItems.actions.edit")}
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const paginationMeta: PaginationMeta | undefined = todoItemsData?.meta
    ? {
        currentPage: todoItemsData.meta.currentPage || params.page || 1,
        previousPage: todoItemsData.meta.previousPage || null,
        nextPage: todoItemsData.meta.nextPage || null,
        perPage: todoItemsData.meta.perPage || params.perPage || 10,
        totalPages: todoItemsData.meta.totalPages || 0,
        totalCount: todoItemsData.meta.totalCount || 0,
        isFirstPage: todoItemsData.meta.isFirstPage ?? true,
        isLastPage: todoItemsData.meta.isLastPage ?? true,
      }
    : undefined;

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Search, Filter and Create Button */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
              {/* Search Input */}
              <div className="relative w-full sm:max-w-md">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t("pages.todoItems.table.searchPlaceholder")}
                  leftIcon={<Search className="w-5 h-5" />}
                  className="w-full"
                />
              </div>

              {/* Archive Filter */}
              <FilterTabs
                tabs={[
                  {
                    text: t("pages.todoItems.filters.all"),
                    action: () => handleArchiveFilterChange("all"),
                  },
                  {
                    text: t("pages.todoItems.filters.active"),
                    action: () => handleArchiveFilterChange("active"),
                  },
                  {
                    text: t("pages.todoItems.filters.archived"),
                    action: () => handleArchiveFilterChange("archived"),
                  },
                ]}
                activeIndex={
                  archiveFilter === "all" ? 0 : archiveFilter === "active" ? 1 : 2
                }
              />
            </div>

            {/* Create Button */}
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-5 h-5" />}
              onClick={() => setIsCreateDrawerOpen(true)}
              className="w-full sm:w-auto"
            >
              {t("pages.todoItems.actions.addTask")}
            </Button>
          </div>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          dataSource={todoItemsData?.data || []}
          loading={isLoading}
          size="middle"
          variant="default"
          hover={true}
          sortField={params.field}
          sortOrder={params.order || null}
          onSort={(field, order) => {
            if (order === null) {
              updateParams({ field: "creationTime", order: "desc" });
            } else {
              updateParams({ field, order });
            }
          }}
          pagination={paginationMeta}
          onPageChange={(page) => updateParams({ page })}
          onPageSizeChange={(perPage) => updateParams({ perPage, page: 1 })}
          emptyText={
            searchTerm
              ? t("pages.todoItems.table.search")
              : t("pages.todoItems.table.noTasks")
          }
        />
      </div>

      {/* Create Drawer */}
      <CreateTodoItemDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onSuccess={() => {
          refetch();
          onRefetch?.();
        }}
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
    </div>
  );
};
