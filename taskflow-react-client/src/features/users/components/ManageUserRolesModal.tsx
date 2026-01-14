import { useState, useEffect } from "react";
import { Shield } from "lucide-react";

import { useLocale } from "../../../features/common/hooks/useLocale";
import { showToast } from "../../../features/common/helpers/toaster";
import { useGetAllRoles } from "../../roles/hooks/useGetAllRoles";
import { Modal } from "../../../components/ui/modal";
import { Button } from "../../../components/form/button";
import { Checkbox } from "../../../components/form/checkbox";
import { useGetUserById } from "../hooks/useGetUserById";
import { useSyncUserRoles } from "../hooks/useSyncUserRoles";

interface ManageUserRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  userId: string | null;
  userEmail: string;
}

export const ManageUserRolesModal = ({
  isOpen,
  onClose,
  onSuccess,
  userId,
  userEmail,
}: ManageUserRolesModalProps) => {
  const { t } = useLocale();
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());

  // Fetch all roles
  const { data: allRoles, isLoading: isLoadingRoles } = useGetAllRoles();

  // Fetch user data to get current roles
  const { data: userData, isLoading: isLoadingUser } = useGetUserById(
    userId || "",
    {
      enabled: isOpen && !!userId,
    }
  );

  // Initialize selected roles when user data is loaded
  useEffect(() => {
    if (userData?.roles && isOpen) {
      const roleIds = new Set(userData.roles.map((r) => r.id));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedRoles(roleIds);
    }
  }, [userData?.roles, isOpen]);

  const { mutate: syncRoles, isPending } = useSyncUserRoles({
    onSuccess: () => {
      showToast(t("pages.users.messages.rolesUpdated"), "success");
      onClose();
      onSuccess?.();
    },
  });

  const handleToggleRole = (roleId: string) => {
    setSelectedRoles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(roleId)) {
        newSet.delete(roleId);
      } else {
        newSet.add(roleId);
      }
      return newSet;
    });
  };

  const handleSave = () => {
    if (!userId) return;

    syncRoles({
      id: userId,
      roleIds: Array.from(selectedRoles),
    });
  };

  const handleClose = () => {
    setSelectedRoles(new Set());
    onClose();
  };

  const isLoading = isLoadingRoles || isLoadingUser;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("pages.users.modals.roles.title", { user: userEmail })}
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
              {t("pages.users.modals.roles.description")}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-800/30 rounded-xl border border-zinc-700/50">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#6366f1]" />
              <span className="text-sm font-medium text-zinc-300">
                {t("pages.users.modals.roles.totalRoles")}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-400">
                {allRoles?.length || 0}
              </span>
              <span className="text-xs text-zinc-500">|</span>
              <span className="text-sm font-medium text-[#6366f1]">
                {selectedRoles.size}{" "}
                {t("pages.users.modals.roles.selected")}
              </span>
            </div>
          </div>

          {/* Roles List */}
          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent hover:scrollbar-thumb-zinc-500 pr-2 space-y-2">
            {allRoles?.map((role) => (
              <div
                key={role.id}
                className="p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer group bg-zinc-800/30 border-zinc-700/50 hover:border-zinc-600/50 hover:bg-zinc-800/50"
                onClick={() => handleToggleRole(role.id)}
              >
                <Checkbox
                  checked={selectedRoles.has(role.id)}
                  onChange={() => handleToggleRole(role.id)}
                  label={role.name}
                />
                {role.description && (
                  <p className="text-xs text-zinc-400 mt-1 ml-7">
                    {role.description}
                  </p>
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
              {t("pages.users.actions.cancel")}
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSave}
              loading={isPending}
            >
              {isPending
                ? t("pages.users.actions.saving")
                : t("pages.users.actions.save")}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
