import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import {
  Edit2,
  Trash2,
  Shield,
  Search,
  Plus,
  Lock,
  Unlock,
  KeyRound,
} from "lucide-react";

import { useLocale } from "../../../features/common/hooks/useLocale";
import { showToast } from "../../../features/common/helpers/toaster";
import { useGetPageableAndFilterUsers } from "../../../features/users/hooks/useGetPageableAndFilterUsers";
import type { UserResponseDto } from "../../../features/users/types/userResponseDto";
import type { GetListUsersRequestDto } from "../../../features/users/types/getListUsersRequestDto";

import { DataTable, type TableColumn, type PaginationMeta } from "../../../components/ui/table";
import { Input } from "../../../components/form/input";
import { Button } from "../../../components/form/button";
import { Badge } from "../../../components/ui/badge";
import { FilterTabs } from "../../../components/ui/filter-tabs";
import { CreateUserModal } from "../../../features/users/components/CreateUserModal";
import { UpdateUserModal } from "../../../features/users/components/UpdateUserModal";
import { DeleteUserModal } from "../../../features/users/components/DeleteUserModal";
import { ManageUserRolesModal } from "../../../features/users/components/ManageUserRolesModal";
import { ResetPasswordModal } from "../../../features/users/components/ResetPasswordModal";
import { useLockUser } from "../../../features/users/hooks/useLockUser";
import { useUnlockUser } from "../../../features/users/hooks/useUnlockUser";

export const UsersPage = () => {
  const { t } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [debouncedSearch] = useDebounce(searchTerm, 600);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
    (searchParams.get("isActive") as "all" | "active" | "inactive") || "all",
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isManageRolesModalOpen, setIsManageRolesModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>("");

  const params = useMemo(
    () => ({
      page: Number(searchParams.get("page")) || 1,
      perPage: Number(searchParams.get("perPage")) || 10,
      search: debouncedSearch || undefined,
      field: searchParams.get("field") || "creationTime",
      order: (searchParams.get("order") as "asc" | "desc") || "desc",
      isActive:
        statusFilter === "all"
          ? undefined
          : statusFilter === "active",
    }),
    [searchParams, debouncedSearch, statusFilter],
  );

  const { data: usersData, isLoading, refetch } = useGetPageableAndFilterUsers(params);

  const updateParams = useCallback((newParams: Partial<GetListUsersRequestDto>) => {
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

  const handleStatusFilterChange = (filter: "all" | "active" | "inactive") => {
    setStatusFilter(filter);
    const isActiveParam =
      filter === "all" ? undefined : filter === "active";
    updateParams({ isActive: isActiveParam, page: 1 });
  };

  const { mutate: lockUser } = useLockUser({
    onSuccess: () => {
      showToast(t("pages.users.messages.userLocked"), "success");
      refetch();
    },
  });

  const { mutate: unlockUser } = useUnlockUser({
    onSuccess: () => {
      showToast(t("pages.users.messages.userUnlocked"), "success");
      refetch();
    },
  });

  const handleEdit = (userId: string) => {
    setSelectedUserId(userId);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (userId: string, userEmail: string) => {
    setSelectedUserId(userId);
    setSelectedUserEmail(userEmail);
    setIsDeleteModalOpen(true);
  };

  const handleManageRoles = (userId: string, userEmail: string) => {
    setSelectedUserId(userId);
    setSelectedUserEmail(userEmail);
    setIsManageRolesModalOpen(true);
  };

  const handleLock = (userId: string) => {
    lockUser(userId);
  };

  const handleUnlock = (userId: string) => {
    unlockUser(userId);
  };

  const handleResetPassword = (userId: string, userEmail: string) => {
    setSelectedUserId(userId);
    setSelectedUserEmail(userEmail);
    setIsResetPasswordModalOpen(true);
  };

  const columns: TableColumn<UserResponseDto>[] = [
    {
      title: t("pages.users.table.name"),
      dataIndex: "firstName",
      sortable: true,
      width: "20%",
      render: (_: unknown, record: UserResponseDto) => {
        const fullName = record.firstName || record.lastName
          ? `${record.firstName || ""} ${record.lastName || ""}`.trim()
          : null;
        
        const initials = fullName
          ? `${record.firstName?.charAt(0) || ""}${record.lastName?.charAt(0) || ""}`.toUpperCase()
          : "?";

        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 border border-[#6366f1]/30 flex items-center justify-center shadow-lg shadow-[#6366f1]/10">
              <span className="text-sm font-semibold text-[#6366f1]">
                {initials}
              </span>
            </div>
            <p className="font-medium text-zinc-200">
              {fullName || "-"}
            </p>
          </div>
        );
      },
    },
    {
      title: t("pages.users.table.email"),
      dataIndex: "email",
      sortable: true,
      width: "20%",
      render: (value: string, record: UserResponseDto) => (
        <div className="flex flex-col">
          <p className="text-zinc-400">{value}</p>
          {record.emailConfirmed && (
            <span className="text-xs text-emerald-400">
              {t("pages.users.table.verified")}
            </span>
          )}
        </div>
      ),
    },
    {
      title: t("pages.users.table.phoneNumber"),
      dataIndex: "phoneNumber",
      sortable: false,
      width: "15%",
      render: (value?: string, record?: UserResponseDto) => (
        <div className="flex flex-col">
          <p className="text-zinc-400">{value || "-"}</p>
          {value && record?.phoneNumberConfirmed && (
            <span className="text-xs text-emerald-400">
              {t("pages.users.table.verified")}
            </span>
          )}
        </div>
      ),
    },
    {
      title: t("pages.users.table.status"),
      dataIndex: "isActive",
      sortable: false,
      width: "10%",
      align: "center",
      render: (isActive: boolean, record: UserResponseDto) => (
        <div className="flex flex-col items-center gap-1">
          <Badge variant={isActive ? "emerald" : "rose"}>
            {isActive
              ? t("pages.users.status.active")
              : t("pages.users.status.inactive")}
          </Badge>
          {record.lockoutEnd && new Date(record.lockoutEnd) > new Date() && (
            <Badge className="mt-1" variant="orange">
              {t("pages.users.status.locked")}
            </Badge>
          )}
        </div>
      ),
    },
    {
      title: t("pages.users.table.actions"),
      dataIndex: "actions" as keyof UserResponseDto,
      width: "15%",
      align: "right",
      render: (_: unknown, record: UserResponseDto) => {
        const isLocked =
          record.lockoutEnd && new Date(record.lockoutEnd) > new Date();
        const isAdmin = record.email === "admin@codium.com";

        return (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => handleManageRoles(record.id, record.email)}
              disabled={isAdmin}
              className="p-2 rounded-lg text-zinc-400 hover:text-[#6366f1] hover:bg-zinc-800/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-zinc-400 disabled:hover:bg-transparent"
              title={t("pages.users.actions.manageRoles")}
            >
              <Shield className="w-4 h-4" />
            </button>
            {isLocked ? (
              <button
                onClick={() => handleUnlock(record.id)}
                disabled={isAdmin}
                className="p-2 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-zinc-400 disabled:hover:bg-transparent"
                title={t("pages.users.actions.unlock")}
              >
                <Unlock className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => handleLock(record.id)}
                disabled={isAdmin}
                className="p-2 rounded-lg text-zinc-400 hover:text-orange-400 hover:bg-zinc-800/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-zinc-400 disabled:hover:bg-transparent"
                title={t("pages.users.actions.lock")}
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => handleResetPassword(record.id, record.email)}
              className="p-2 rounded-lg text-zinc-400 hover:text-purple-400 hover:bg-zinc-800/50 transition-all duration-200"
              title={t("pages.users.actions.resetPassword")}
            >
              <KeyRound className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEdit(record.id)}
              disabled={isAdmin}
              className="p-2 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-zinc-400 disabled:hover:bg-transparent"
              title={t("pages.users.actions.edit")}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(record.id, record.email)}
              disabled={isAdmin}
              className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-zinc-400 disabled:hover:bg-transparent"
              title={t("pages.users.actions.delete")}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  const paginationMeta: PaginationMeta | undefined = usersData?.meta
    ? {
        currentPage: usersData.meta.currentPage || params.page || 1,
        previousPage: usersData.meta.previousPage || null,
        nextPage: usersData.meta.nextPage || null,
        perPage: usersData.meta.perPage || params.perPage || 10,
        totalPages: usersData.meta.totalPages || 0,
        totalCount: usersData.meta.totalCount || 0,
        isFirstPage: usersData.meta.isFirstPage ?? true,
        isLastPage: usersData.meta.isLastPage ?? true,
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
                  placeholder={t("pages.users.table.searchPlaceholder")}
                  leftIcon={<Search className="w-5 h-5" />}
                  className="w-full"
                />
              </div>

              {/* Status Filter */}
              <FilterTabs
                tabs={[
                  {
                    text: t("pages.users.filters.all"),
                    action: () => handleStatusFilterChange("all"),
                  },
                  {
                    text: t("pages.users.filters.active"),
                    action: () => handleStatusFilterChange("active"),
                  },
                  {
                    text: t("pages.users.filters.inactive"),
                    action: () => handleStatusFilterChange("inactive"),
                  },
                ]}
                activeIndex={
                  statusFilter === "all" ? 0 : statusFilter === "active" ? 1 : 2
                }
              />
            </div>

            {/* Create Button */}
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-5 h-5" />}
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto"
            >
              {t("pages.users.actions.create")}
            </Button>
          </div>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          dataSource={usersData?.data || []}
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
              ? t("pages.users.table.search")
              : t("pages.users.table.noUsers")
          }
        />
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => refetch()}
      />

      {/* Update User Modal */}
      <UpdateUserModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedUserId(null);
        }}
        onSuccess={() => refetch()}
        userId={selectedUserId}
      />

      {/* Delete User Modal */}
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUserId(null);
          setSelectedUserEmail("");
        }}
        onSuccess={() => refetch()}
        userId={selectedUserId}
        userEmail={selectedUserEmail}
      />

      {/* Manage User Roles Modal */}
      <ManageUserRolesModal
        isOpen={isManageRolesModalOpen}
        onClose={() => {
          setIsManageRolesModalOpen(false);
          setSelectedUserId(null);
          setSelectedUserEmail("");
        }}
        onSuccess={() => refetch()}
        userId={selectedUserId}
        userEmail={selectedUserEmail}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => {
          setIsResetPasswordModalOpen(false);
          setSelectedUserId(null);
          setSelectedUserEmail("");
        }}
        onSuccess={() => refetch()}
        userId={selectedUserId}
        userEmail={selectedUserEmail}
      />
    </div>
  );
};
