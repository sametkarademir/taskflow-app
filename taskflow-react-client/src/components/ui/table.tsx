import React, { useState } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Inbox,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { clsx } from "clsx";
import { Trans } from "react-i18next";

import { useLocale } from "../../features/common/hooks/useLocale";
import { Select } from "../form/select";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface TableProps<T = any> {
  dataSource: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  size?: "small" | "middle" | "large";
  variant?: "default" | "bordered" | "striped";
  hover?: boolean;
  className?: string;
  emptyText?: React.ReactNode;
  onSort?: (field: string, order: "asc" | "desc" | null) => void;
  sortField?: string;
  sortOrder?: "asc" | "desc" | null;
  onRow?: (
    record: T,
    index: number,
  ) => {
    onClick?: () => void;
    onDoubleClick?: () => void;
    className?: string;
  };
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (perPage: number) => void;
  pageSizeOptions?: number[];
  showSizeChanger?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface TableColumn<T = any> {
  title: string;
  dataIndex: keyof T;
  width?: string | number;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

export interface PaginationMeta {
  currentPage: number;
  previousPage?: number | null;
  nextPage?: number | null;
  perPage: number;
  totalPages: number;
  totalCount: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DataTable = <T extends Record<string, any>>({
  dataSource = [],
  columns,
  loading = false,
  size = "middle",
  variant = "default",
  hover = true,
  className = "",
  emptyText = "No data",
  onSort,
  sortField,
  sortOrder,
  onRow,
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50],
  showSizeChanger = true,
}: TableProps<T>) => {
  const { t } = useLocale();

  const [internalSort, setInternalSort] = useState<{
    field?: string;
    order?: "asc" | "desc";
  }>({});

  // Sync internal sort state with props
  React.useEffect(() => {
    if (sortField !== undefined) {
      setInternalSort(
        sortOrder ? { field: sortField, order: sortOrder } : {},
      );
    }
  }, [sortField, sortOrder]);

  const variantClasses = {
    default: "border border-zinc-800/50 shadow-lg shadow-zinc-900/20",
    bordered: "border-2 border-zinc-700/50 shadow-xl shadow-zinc-900/30",
    striped: "border border-zinc-800/50 shadow-lg shadow-zinc-900/20",
  };

  const sizeClasses = {
    small: {
      header: "px-4 py-3 text-xs font-semibold",
      cell: "px-4 py-3 text-xs",
    },
    middle: {
      header: "px-6 py-4 text-sm font-semibold",
      cell: "px-6 py-4 text-sm",
    },
    large: {
      header: "px-8 py-5 text-base font-semibold",
      cell: "px-8 py-5 text-base",
    },
  };

  const allColumns: TableColumn<T>[] = columns;

  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable) return;

    const field = column.dataIndex as string;
    let newOrder: "asc" | "desc" | null = "asc";

    if (internalSort.field === field) {
      if (internalSort.order === "asc") {
        newOrder = "desc";
      } else if (internalSort.order === "desc") {
        newOrder = null;
      }
    }

    const sortData = newOrder ? { field, order: newOrder } : {};
    setInternalSort(sortData);

    if (onSort) {
      onSort(field, newOrder);
    }
  };

  const generatePageNumbers = () => {
    if (!pagination) return [];

    const { currentPage, totalPages } = pagination;
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }

    return pages;
  };

  const handlePageClick = (page: number | string) => {
    if (!pagination || !onPageChange) return;

    if (typeof page === "number" && page !== pagination.currentPage) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (!pagination || !onPageChange) return;

    if (!pagination.isFirstPage) {
      onPageChange(pagination.currentPage - 1);
    }
  };

  const handleNext = () => {
    if (!pagination || !onPageChange) return;

    if (!pagination.isLastPage) {
      onPageChange(pagination.currentPage + 1);
    }
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (!onPageSizeChange) return;

    const newPageSize = parseInt(event.target.value);
    onPageSizeChange(newPageSize);
  };

  if (loading) {
    return (
      <div
        className={clsx(
          "overflow-hidden rounded-2xl",
          variantClasses[variant],
          "bg-zinc-900/80 backdrop-blur-xl",
          className,
        )}
      >
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full blur opacity-20 animate-pulse"></div>
            <div className="relative animate-spin rounded-full h-12 w-12 border-2 border-[#6366f1] border-t-transparent"></div>
          </div>
          <p className="mt-6 text-sm font-medium text-zinc-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  const pageNumbers = generatePageNumbers();

  return (
    <div className={clsx("flex flex-col gap-4", className)}>
      <div
        className={clsx(
          "overflow-hidden rounded-2xl bg-zinc-900/80 backdrop-blur-xl",
          "border border-zinc-800/50",
          "shadow-lg shadow-zinc-900/20",
          variantClasses[variant],
        )}
      >
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent hover:scrollbar-thumb-zinc-500">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-800/50 border-b border-zinc-700/50">
                {allColumns.map((column: TableColumn<T>, index: number) => (
                  <th
                    key={index}
                    style={{ width: column.width }}
                    className={clsx(
                      "p-4 text-xs font-semibold tracking-wide uppercase",
                      "text-zinc-400",
                      sizeClasses[size].header,
                      column.headerClassName,
                      {
                        "text-left": column.align === "left" || !column.align,
                        "text-center": column.align === "center",
                        "text-right": column.align === "right",
                        "cursor-pointer group/sort hover:bg-zinc-700/50 transition-all duration-200":
                          column.sortable,
                      },
                    )}
                    onClick={() => column.sortable && handleSort(column)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="select-none">{column.title}</span>
                      {column.sortable && (
                        <div className="flex items-center">
                          {internalSort.field === (column.dataIndex as string) ? (
                            internalSort.order === "asc" ? (
                              <ArrowUp className="w-4 h-4 text-[#6366f1]" />
                            ) : (
                              <ArrowDown className="w-4 h-4 text-[#8b5cf6]" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 group-hover/sort:text-zinc-400 transition-colors" />
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {dataSource.length === 0 ? (
                <tr>
                  <td colSpan={allColumns.length} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative group/empty">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-2xl blur opacity-10 group-hover/empty:opacity-20 transition duration-300"></div>
                        <div className="relative w-20 h-20 rounded-2xl bg-zinc-800/80 backdrop-blur-xl flex items-center justify-center mb-5 shadow-lg border border-zinc-700/50">
                          <Inbox className="w-10 h-10 text-zinc-500" />
                        </div>
                      </div>
                      <p className="text-base font-semibold text-zinc-400 mb-1">
                        {emptyText}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                dataSource.map((record, index) => {
                  const rowProps = onRow?.(record, index) || {};

                  return (
                    <tr
                      key={index}
                      className={clsx(
                        "group transition-all duration-200",
                        hover && "hover:bg-[#6366f1]/5",
                        variant === "striped" &&
                          index % 2 === 1 &&
                          "bg-zinc-800/30",
                        rowProps.onClick &&
                          "cursor-pointer hover:bg-[#6366f1]/10",
                        rowProps.className,
                      )}
                      onClick={rowProps.onClick}
                      onDoubleClick={rowProps.onDoubleClick}
                    >
                      {allColumns.map((column, colIndex) => {
                        const value = column.dataIndex
                          ? record[column.dataIndex]
                          : undefined;

                        return (
                          <td
                            key={colIndex}
                            className={clsx(
                              "p-4",
                              sizeClasses[size].cell,
                              "text-zinc-300",
                              "transition-colors duration-150",
                              {
                                "text-left":
                                  column.align === "left" || !column.align,
                                "text-center": column.align === "center",
                                "text-right": column.align === "right",
                              },
                              column.className,
                            )}
                          >
                            {column.render
                              ? column.render(value, record, index)
                              : value?.toString() || ""}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <div
          className={clsx(
            "flex items-center justify-between py-4 px-6 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl shadow-lg",
          )}
        >
          <p className="text-sm text-zinc-400">
            <Trans
              i18nKey="components.pagination.labels.total"
              values={{ length: pagination.totalCount }}
              components={{
                strong: (
                  <strong className="font-bold text-[#6366f1]" />
                ),
              }}
            />
          </p>

          <div className="flex items-center gap-6">
            {pagination.totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevious}
                  disabled={pagination.isFirstPage}
                  className={clsx(
                    "p-2 rounded-lg border transition-all duration-200",
                    pagination.isFirstPage
                      ? "border-zinc-700/50 text-zinc-600 cursor-not-allowed opacity-50"
                      : "border-zinc-700/50 text-zinc-400 hover:bg-zinc-800/50 hover:text-[#6366f1] hover:border-[#6366f1]/30",
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {pageNumbers.map((page, index) => (
                  <React.Fragment key={index}>
                    {page === "..." ? (
                      <span className="px-3 py-2 text-zinc-500">...</span>
                    ) : (
                      <button
                        onClick={() => handlePageClick(page)}
                        className={clsx(
                          "min-w-[40px] px-3 py-2 text-sm rounded-lg border transition-all duration-200",
                          page === pagination.currentPage
                            ? "bg-gradient-to-r from-[#6366f1]/20 to-[#8b5cf6]/20 border-[#6366f1]/50 text-[#6366f1] font-semibold shadow-lg shadow-[#6366f1]/10"
                            : "border-zinc-700/50 text-zinc-400 hover:bg-zinc-800/50 hover:text-[#6366f1] hover:border-[#6366f1]/30",
                        )}
                      >
                        {page}
                      </button>
                    )}
                  </React.Fragment>
                ))}

                <button
                  onClick={handleNext}
                  disabled={pagination.isLastPage}
                  className={clsx(
                    "p-2 rounded-lg border transition-all duration-200",
                    pagination.isLastPage
                      ? "border-zinc-700/50 text-zinc-600 cursor-not-allowed opacity-50"
                      : "border-zinc-700/50 text-zinc-400 hover:bg-zinc-800/50 hover:text-[#6366f1] hover:border-[#6366f1]/30",
                  )}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {showSizeChanger && onPageSizeChange && (
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <span>{t("components.pagination.labels.page")}:</span>
                <Select
                  value={pagination.perPage}
                  onChange={handlePageSizeChange}
                  options={pageSizeOptions.map((option) => ({
                    value: option,
                    label: option.toString(),
                  }))}
                  className="w-20"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
