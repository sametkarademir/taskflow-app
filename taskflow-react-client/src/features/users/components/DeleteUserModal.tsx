import { AlertTriangle } from "lucide-react";

import { useLocale } from "../../../features/common/hooks/useLocale";
import { showToast } from "../../../features/common/helpers/toaster";
import { Modal } from "../../../components/ui/modal";
import { Button } from "../../../components/form/button";
import { useDeleteUser } from "../hooks/useDeleteUser";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  userId: string | null;
  userEmail: string;
}

export const DeleteUserModal = ({
  isOpen,
  onClose,
  onSuccess,
  userId,
  userEmail,
}: DeleteUserModalProps) => {
  const { t } = useLocale();

  const { mutate: deleteUser, isPending } = useDeleteUser({
    onSuccess: () => {
      showToast(t("pages.users.messages.deleteSuccess"), "success");
      onClose();
      onSuccess?.();
    },
  });

  const handleDelete = () => {
    if (!userId) return;
    deleteUser(userId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("pages.users.modals.delete.title")}
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
              {t("pages.users.modals.delete.message", { userEmail })}
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
            {t("pages.users.actions.cancel")}
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            loading={isPending}
          >
            {isPending
              ? t("pages.users.actions.deleting")
              : t("pages.users.actions.delete")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
