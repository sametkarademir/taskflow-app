import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLocale } from "../../../features/common/hooks/useLocale";
import { showToast } from "../../../features/common/helpers/toaster";
import { Modal } from "../../../components/ui/modal";
import { Input } from "../../../components/form/input";
import { Label } from "../../../components/form/label";
import { Button } from "../../../components/form/button";
import { useResetPassword } from "../hooks/useResetPassword";
import {
  createResetPasswordUserSchemaFactory,
  type ResetPasswordUserFormType,
  DEFAULT_RESET_PASSWORD_USER_FORM_VALUES,
} from "../schemas/resetPasswordUserSchema";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  userId: string | null;
  userEmail: string;
}

export const ResetPasswordModal = ({
  isOpen,
  onClose,
  onSuccess,
  userId,
  userEmail,
}: ResetPasswordModalProps) => {
  const { t } = useLocale();
  const schema = createResetPasswordUserSchemaFactory(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordUserFormType>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_RESET_PASSWORD_USER_FORM_VALUES,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const { mutate: resetPassword, isPending } = useResetPassword({
    onSuccess: () => {
      showToast(t("pages.users.messages.passwordReset"), "success");
      reset();
      onClose();
      onSuccess?.();
    },
  });

  const onSubmit = (data: ResetPasswordUserFormType) => {
    if (!userId) return;
    resetPassword({ id: userId, data });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("pages.users.modals.resetPassword.title", { user: userEmail })}
      size="md"
    >
      <div className="space-y-6 my-4">
        {/* Info Box */}
        <div className="bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-xl p-4">
          <p className="text-sm text-[#6366f1]">
            {t("pages.users.modals.resetPassword.description")}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" isRequired>
              {t("pages.users.forms.password.label")}
            </Label>
            <Input
              id="newPassword"
              type="password"
              {...register("newPassword")}
              placeholder={t("pages.users.forms.password.placeholder")}
              error={!!errors.newPassword}
              hint={errors.newPassword?.message}
              disabled={isPending}
            />
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword" isRequired>
              {t("pages.users.forms.confirmPassword.label")}
            </Label>
            <Input
              id="confirmNewPassword"
              type="password"
              {...register("confirmNewPassword")}
              placeholder={t("pages.users.forms.confirmPassword.placeholder")}
              error={!!errors.confirmNewPassword}
              hint={errors.confirmNewPassword?.message}
              disabled={isPending}
            />
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
            <Button type="submit" variant="primary" loading={isPending}>
              {isPending
                ? t("pages.users.actions.saving")
                : t("pages.users.actions.save")}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
