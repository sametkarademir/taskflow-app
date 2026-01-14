import { useState, useEffect, useMemo } from "react";
import { Shield, ChevronDown, ChevronUp } from "lucide-react";
import { clsx } from "clsx";

import { useLocale } from "../../../features/common/hooks/useLocale";
import { showToast } from "../../../features/common/helpers/toaster";
import { usePermissions } from "../../../features/permissions/hooks/usePermissions";
import { Modal } from "../../../components/ui/modal";
import { Button } from "../../../components/form/button";
import { Checkbox } from "../../../components/form/checkbox";
import { useGetRoleById } from "../hooks/useGetRoleById";
import { useSyncRolePermissions } from "../hooks/useSyncRolePermissions";

interface ManagePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  roleId: string | null;
  roleName: string;
}

export const ManagePermissionsModal = ({
  isOpen,
  onClose,
  onSuccess,
  roleId,
  roleName,
}: ManagePermissionsModalProps) => {
  const { t } = useLocale();
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(),
  );

  // Fetch all permissions
  const { data: allPermissions, isLoading: isLoadingPermissions } =
    usePermissions();

  // Fetch role data to get current permissions
  const { data: roleData, isLoading: isLoadingRole } = useGetRoleById(
    roleId || "",
    {
      enabled: isOpen && !!roleId,
    },
  );

  // Initialize selected permissions when role data is loaded
  useEffect(() => {
    if (roleData?.permissions && isOpen) {
      const permissionIds = new Set(
        roleData.permissions.map((p) => p.id),
      );
      setSelectedPermissions(permissionIds);
    }
  }, [roleData, isOpen]);

  const { mutate: syncPermissions, isPending } = useSyncRolePermissions({
    onSuccess: () => {
      showToast(t("pages.roles.messages.permissionsUpdated"), "success");
      onClose();
      onSuccess?.();
    },
  });

  // Group permissions by prefix (e.g., "User.Create" -> "User")
  const groupedPermissions = useMemo(() => {
    if (!allPermissions) return {};

    const groups: Record<string, typeof allPermissions> = {};

    allPermissions.forEach((permission) => {
      const parts = permission.name.split(".");
      const groupName = parts.length > 1 ? parts[0] : "Other";
      
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(permission);
    });

    return groups;
  }, [allPermissions]);

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Expand all groups by default
  useEffect(() => {
    if (Object.keys(groupedPermissions).length > 0) {
      setExpandedGroups(new Set(Object.keys(groupedPermissions)));
    }
  }, [groupedPermissions]);

  const handleToggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(permissionId)) {
        newSet.delete(permissionId);
      } else {
        newSet.add(permissionId);
      }
      return newSet;
    });
  };

  const handleSave = () => {
    if (!roleId) return;

    syncPermissions({
      id: roleId,
      requestBody: { permissionIds: Array.from(selectedPermissions) },
    });
  };

  const handleClose = () => {
    setSelectedPermissions(new Set());
    onClose();
  };

  const isLoading = isLoadingPermissions || isLoadingRole;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("pages.roles.modals.permissions.title", { role: roleName })}
      size="lg"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full blur opacity-20 animate-pulse"></div>
            <div className="relative animate-spin rounded-full h-12 w-12 border-2 border-[#6366f1] border-t-transparent"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 my-4">
          {/* Info Box */}
          <div className="bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-xl p-4">
            <p className="text-sm text-[#6366f1]">
              {t("pages.roles.modals.permissions.description")}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-800/30 rounded-xl border border-zinc-700/50">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#6366f1]" />
              <span className="text-sm font-medium text-zinc-300">
                {t("pages.roles.modals.permissions.totalPermissions")}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-400">
                {allPermissions?.length || 0}
              </span>
              <span className="text-xs text-zinc-500">|</span>
              <span className="text-sm font-medium text-[#6366f1]">
                {selectedPermissions.size}{" "}
                {t("pages.roles.modals.permissions.selected")}
              </span>
            </div>
          </div>

          {/* Permissions Grouped List */}
          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent hover:scrollbar-thumb-zinc-500 pr-2 space-y-3">
            {Object.entries(groupedPermissions).map(([groupName, permissions]) => (
              <div
                key={groupName}
                className="bg-zinc-800/30 border border-zinc-700/50 rounded-xl overflow-hidden"
              >
                {/* Group Header */}
                <button
                  onClick={() => handleToggleGroup(groupName)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-zinc-200">
                      {groupName}
                    </span>
                    <span className="text-xs text-zinc-500">
                      ({permissions.length})
                    </span>
                  </div>
                  {expandedGroups.has(groupName) ? (
                    <ChevronUp className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                  )}
                </button>

                {/* Group Content */}
                {expandedGroups.has(groupName) && (
                  <div className="px-4 pb-3 space-y-2">
                    {permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className={clsx(
                          "p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer group",
                          selectedPermissions.has(permission.id)
                            ? "bg-[#6366f1]/10 border-[#6366f1]/50 shadow-lg shadow-[#6366f1]/10"
                            : "bg-zinc-800/30 border-zinc-700/50 hover:border-zinc-600/50 hover:bg-zinc-800/50",
                        )}
                        onClick={() => handleTogglePermission(permission.id)}
                      >
                        <Checkbox
                          checked={selectedPermissions.has(permission.id)}
                          onChange={() => handleTogglePermission(permission.id)}
                          label={permission.name.replace(`${groupName}.`, "")}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/50">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isPending}
            >
              {t("pages.roles.actions.cancel")}
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSave}
              loading={isPending}
            >
              {isPending
                ? t("pages.roles.actions.saving")
                : t("pages.roles.actions.save")}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
