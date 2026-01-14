import { AlertTriangle } from "lucide-react";

import { useLocale } from "../../../features/common/hooks/useLocale";
import { showToast } from "../../../features/common/helpers/toaster";
import { Modal } from "../../../components/ui/modal";
import { Button } from "../../../components/form/button";
import { useDeleteRole } from "../hooks/useDeleteRole";

interface DeleteRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  roleId: string | null;
  roleName: string;
}

export const DeleteRoleModal = ({
  isOpen,
  onClose,
  onSuccess,
  roleId,
  roleName,
}: DeleteRoleModalProps) => {
  const { t } = useLocale();

  const { mutate: deleteRole, isPending } = useDeleteRole({
    onSuccess: () => {
      showToast(t("pages.roles.messages.deleteSuccess"), "success");
      onClose();
      onSuccess?.();
    },
  });

  const handleDelete = () => {
    if (!roleId) return;
    deleteRole({ id: roleId });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("pages.roles.modals.delete.title")}
      size="md"
    >
      <div className="space-y-6 my-4">
        {/* Alert Message */}
        <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <div className="flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-zinc-300">
              {t("pages.roles.modals.delete.message", { roleName })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/50">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
          >
            {t("pages.roles.actions.cancel")}
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            loading={isPending}
          >
            {isPending
              ? t("pages.roles.actions.deleting")
              : t("pages.roles.actions.delete")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
