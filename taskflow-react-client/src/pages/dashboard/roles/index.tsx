import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { Edit2, Trash2, Shield, Search, Plus } from "lucide-react";

import { useLocale } from "../../../features/common/hooks/useLocale";
import { useGetPageableAndFilterRoles } from "../../../features/roles/hooks/useGetPageableAndFilterRoles";
import type { RoleResponseDto } from "../../../features/roles/types/roleResponseDto";
import type { GetListRolesRequestDto } from "../../../features/roles/types/getListRolesRequestDto";

import { DataTable, type TableColumn, type PaginationMeta } from "../../../components/ui/table";
import { Input } from "../../../components/form/input";
import { Button } from "../../../components/form/button";
import { CreateRoleModal } from "../../../features/roles/components/CreateRoleModal";
import { UpdateRoleModal } from "../../../features/roles/components/UpdateRoleModal";
import { DeleteRoleModal } from "../../../features/roles/components/DeleteRoleModal";
import { ManagePermissionsModal } from "../../../features/roles/components/ManagePermissionsModal";

export const RolesPage = () => {
  const { t } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [debouncedSearch] = useDebounce(searchTerm, 600);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isManagePermissionsModalOpen, setIsManagePermissionsModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [selectedRoleName, setSelectedRoleName] = useState<string>("");

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

  const { data: rolesData, isLoading, refetch } = useGetPageableAndFilterRoles(params);

  const updateParams = useCallback((newParams: Partial<GetListRolesRequestDto>) => {
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

  // Helper function to check if role is Admin or TodoUser
  const isAdminRole = (roleName: string) => roleName === "Admin";
  const isTodoUser = (roleName: string) => roleName === "Member";

  // Handle edit role
  const handleEdit = (roleId: string) => {
    setSelectedRoleId(roleId);
    setIsUpdateModalOpen(true);
  };

  // Handle delete role
  const handleDelete = (roleId: string, roleName: string) => {
    setSelectedRoleId(roleId);
    setSelectedRoleName(roleName);
    setIsDeleteModalOpen(true);
  };

  // Handle manage permissions
  const handleManagePermissions = (roleId: string, roleName: string) => {
    setSelectedRoleId(roleId);
    setSelectedRoleName(roleName);
    setIsManagePermissionsModalOpen(true);
  };

  const columns: TableColumn<RoleResponseDto>[] = [
    {
      title: t("pages.roles.table.name"),
      dataIndex: "name",
      sortable: true,
      width: "20%",
      render: (value: string) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 border border-[#6366f1]/30 flex items-center justify-center shadow-lg shadow-[#6366f1]/10">
            <span className="text-sm font-semibold text-[#6366f1]">
              {value.charAt(0).toUpperCase()}
            </span>
          </div>
          <p className="font-medium text-zinc-200">{value}</p>
        </div>
      ),
    },
    {
      title: t("pages.roles.table.description"),
      dataIndex: "description",
      sortable: true,
      width: "50%",
      render: (value?: string) => (
        <p className="text-zinc-400">{value || "-"}</p>
      ),
    },
    {
      title: t("pages.roles.table.actions"),
      dataIndex: "actions" as keyof RoleResponseDto,
      width: "15%",
      align: "right",
      render: (_: unknown, record: RoleResponseDto) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleManagePermissions(record.id, record.name)}
            disabled={isAdminRole(record.name)}
            className="p-2 rounded-lg text-zinc-400 hover:text-[#6366f1] hover:bg-zinc-800/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-zinc-400 disabled:hover:bg-transparent"
            title="İzinleri Yönet"
          >
            <Shield className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(record.id)}
            disabled={isAdminRole(record.name)}
            className="p-2 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-zinc-400 disabled:hover:bg-transparent"
            title="Düzenle"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(record.id, record.name)}
            disabled={isAdminRole(record.name) || isTodoUser(record.name)}
            className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-zinc-400 disabled:hover:bg-transparent"
            title="Sil"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const paginationMeta: PaginationMeta | undefined = rolesData?.meta
    ? {
        currentPage: rolesData.meta.currentPage || params.page || 1,
        previousPage: rolesData.meta.previousPage || null,
        nextPage: rolesData.meta.nextPage || null,
        perPage: rolesData.meta.perPage || params.perPage || 10,
        totalPages: rolesData.meta.totalPages || 0,
        totalCount: rolesData.meta.totalCount || 0,
        isFirstPage: rolesData.meta.isFirstPage ?? true,
        isLastPage: rolesData.meta.isLastPage ?? true,
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
                placeholder={t("pages.roles.table.searchPlaceholder")}
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
              {t("pages.roles.actions.create")}
            </Button>
          </div>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          dataSource={rolesData?.data || []}
          loading={isLoading}
          size="middle"
          variant="default"
          hover={true}
          onRow={(record) => ({
            onDoubleClick: () => {
              if (!isAdminRole(record.name) && !isTodoUser(record.name)) {
                handleEdit(record.id);
              }
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
              ? t("pages.roles.table.search")
              : t("pages.roles.table.noRoles")
          }
        />
      </div>

      {/* Create Role Modal */}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => refetch()}
      />

      {/* Update Role Modal */}
      <UpdateRoleModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedRoleId(null);
        }}
        onSuccess={() => refetch()}
        roleId={selectedRoleId}
      />

      {/* Delete Role Modal */}
      <DeleteRoleModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedRoleId(null);
          setSelectedRoleName("");
        }}
        onSuccess={() => refetch()}
        roleId={selectedRoleId}
        roleName={selectedRoleName}
      />

      {/* Manage Permissions Modal */}
      <ManagePermissionsModal
        isOpen={isManagePermissionsModalOpen}
        onClose={() => {
          setIsManagePermissionsModalOpen(false);
          setSelectedRoleId(null);
          setSelectedRoleName("");
        }}
        onSuccess={() => refetch()}
        roleId={selectedRoleId}
        roleName={selectedRoleName}
      />
    </div>
  );
};
