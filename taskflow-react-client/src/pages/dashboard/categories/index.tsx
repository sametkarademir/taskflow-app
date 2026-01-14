import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { Edit2, Trash2, Search, Plus } from "lucide-react";

import { useLocale } from "../../../features/common/hooks/useLocale";
import { useGetPagedAndFilterCategories } from "../../../features/categories/hooks/useGetPagedAndFilterCategories";
import type { CategoryResponseDto } from "../../../features/categories/types/categoryResponseDto";
import type { GetListCategoriesRequestDto } from "../../../features/categories/types/getListCategoriesRequestDto";

import { DataTable, type TableColumn, type PaginationMeta } from "../../../components/ui/table";
import { Input } from "../../../components/form/input";
import { Button } from "../../../components/form/button";
import { CreateCategoryModal } from "../../../features/categories/components/CreateCategoryModal";
import { UpdateCategoryModal } from "../../../features/categories/components/UpdateCategoryModal";
import { DeleteCategoryModal } from "../../../features/categories/components/DeleteCategoryModal";

export const CategoryPage = () => {
  const { t } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [debouncedSearch] = useDebounce(searchTerm, 600);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");

  const params = useMemo(
    () => ({
      page: Number(searchParams.get("page")) || 1,
      perPage: Number(searchParams.get("perPage")) || 10,
      search: debouncedSearch || undefined,
      field: searchParams.get("field") || "creationTime",
      order: (searchParams.get("order") as "asc" | "desc") || "desc",
    }),
    [searchParams, debouncedSearch],
  );

  const { data: categoriesData, isLoading, refetch } = useGetPagedAndFilterCategories(params);

  const updateParams = useCallback((newParams: Partial<GetListCategoriesRequestDto>) => {
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

  // Handle edit category
  const handleEdit = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setIsUpdateModalOpen(true);
  };

  // Handle delete category
  const handleDelete = (categoryId: string, categoryName: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedCategoryName(categoryName);
    setIsDeleteModalOpen(true);
  };

  const columns: TableColumn<CategoryResponseDto>[] = [
    {
      title: t("pages.categories.table.name"),
      dataIndex: "name",
      sortable: true,
      width: "25%",
      render: (value: string, record: CategoryResponseDto) => (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl border-2 border-zinc-700 flex items-center justify-center shadow-lg"
            style={{
              backgroundColor: record.colorHex || "#6366f1",
            }}
          >
            <span className="text-sm font-semibold text-white">
              {value.charAt(0).toUpperCase()}
            </span>
          </div>
          <p className="font-medium text-zinc-200">{value}</p>
        </div>
      ),
    },
    {
      title: t("pages.categories.table.description"),
      dataIndex: "description",
      sortable: false,
      width: "50%",
      render: (value?: string) => (
        <p className="text-zinc-400">{value || "-"}</p>
      ),
    },
    {
      title: t("pages.categories.table.color"),
      dataIndex: "colorHex",
      sortable: false,
      width: "10%",
      render: (value?: string) => (
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg border-2 border-zinc-700"
            style={{
              backgroundColor: value || "#6366f1",
            }}
          />
          <span className="text-sm text-zinc-400">{value || "-"}</span>
        </div>
      ),
    },
    {
      title: t("pages.categories.table.actions"),
      dataIndex: "actions" as keyof CategoryResponseDto,
      width: "15%",
      align: "right",
      render: (_: unknown, record: CategoryResponseDto) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleEdit(record.id)}
            className="p-2 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800/50 transition-all duration-200"
            title={t("pages.categories.actions.edit")}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(record.id, record.name)}
            className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800/50 transition-all duration-200"
            title={t("pages.categories.actions.delete")}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const paginationMeta: PaginationMeta | undefined = categoriesData?.meta
    ? {
        currentPage: categoriesData.meta.currentPage || params.page || 1,
        previousPage: categoriesData.meta.previousPage || null,
        nextPage: categoriesData.meta.nextPage || null,
        perPage: categoriesData.meta.perPage || params.perPage || 10,
        totalPages: categoriesData.meta.totalPages || 0,
        totalCount: categoriesData.meta.totalCount || 0,
        isFirstPage: categoriesData.meta.isFirstPage ?? true,
        isLastPage: categoriesData.meta.isLastPage ?? true,
      }
    : undefined;

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Search and Create Button */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-md flex-1">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("pages.categories.table.searchPlaceholder")}
                leftIcon={<Search className="w-5 h-5" />}
                className="w-full"
              />
            </div>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-5 h-5" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              {t("pages.categories.actions.create")}
            </Button>
          </div>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          dataSource={categoriesData?.data || []}
          loading={isLoading}
          size="middle"
          variant="default"
          hover={true}
          onRow={(record) => ({
            onDoubleClick: () => {
              handleEdit(record.id);
            },
          })}
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
              ? t("pages.categories.table.search")
              : t("pages.categories.table.noCategories")
          }
        />
      </div>

      {/* Create Category Modal */}
      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => refetch()}
      />

      {/* Update Category Modal */}
      <UpdateCategoryModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedCategoryId(null);
        }}
        onSuccess={() => refetch()}
        categoryId={selectedCategoryId}
      />

      {/* Delete Category Modal */}
      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCategoryId(null);
          setSelectedCategoryName("");
        }}
        onSuccess={() => refetch()}
        categoryId={selectedCategoryId}
        categoryName={selectedCategoryName}
      />
    </div>
  );
};
