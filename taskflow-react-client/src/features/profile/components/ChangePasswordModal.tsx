import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";

import { useLocale } from "../../common/hooks/useLocale";
import { showToast } from "../../common/helpers/toaster";
import { Modal } from "../../../components/ui/modal";
import { Input } from "../../../components/form/input";
import { Label } from "../../../components/form/label";
import { Button } from "../../../components/form/button";
import { useChangePassword } from "../hooks/useChangePassword";
import {
  createChangePasswordSchemaFactory,
  type ChangePasswordFormType,
  DEFAULT_CHANGE_PASSWORD_FORM_VALUES,
} from "../schemas/changePasswordSchema";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal = ({
  isOpen,
  onClose,
}: ChangePasswordModalProps) => {
  const { t } = useLocale();
  const schema = createChangePasswordSchemaFactory(t);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormType>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_CHANGE_PASSWORD_FORM_VALUES,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const { mutate: changePassword, isPending } = useChangePassword({
    onSuccess: () => {
      showToast(t("pages.profile.messages.changePasswordSuccess"), "success");
      reset();
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      onClose();
    },
    onError: (error: Error) => {
      showToast(
        error.message || t("pages.profile.messages.changePasswordError"),
        "error",
      );
    },
  });

  const onSubmit = (data: ChangePasswordFormType) => {
    changePassword(data);
  };

  const handleClose = () => {
    reset();
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("pages.profile.modals.changePassword.title")}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 my-4">
        {/* Old Password */}
        <div className="space-y-2">
          <Label htmlFor="oldPassword" isRequired>
            {t("pages.profile.forms.oldPassword.label")}
          </Label>
          <Input
            id="oldPassword"
            type={showOldPassword ? "text" : "password"}
            {...register("oldPassword")}
            placeholder={t("pages.profile.forms.oldPassword.placeholder")}
            error={!!errors.oldPassword}
            hint={errors.oldPassword?.message}
            disabled={isPending}
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowOldPassword((prev) => !prev)}
                className="text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {showOldPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
          />
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="newPassword" isRequired>
            {t("pages.profile.forms.newPassword.label")}
          </Label>
          <Input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            {...register("newPassword")}
            placeholder={t("pages.profile.forms.newPassword.placeholder")}
            error={!!errors.newPassword}
            hint={errors.newPassword?.message}
            disabled={isPending}
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
          />
        </div>

        {/* Confirm New Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmNewPassword" isRequired>
            {t("pages.profile.forms.confirmNewPassword.label")}
          </Label>
          <Input
            id="confirmNewPassword"
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmNewPassword")}
            placeholder={t(
              "pages.profile.forms.confirmNewPassword.placeholder",
            )}
            error={!!errors.confirmNewPassword}
            hint={errors.confirmNewPassword?.message}
            disabled={isPending}
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
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
            {t("pages.profile.actions.cancel")}
          </Button>
          <Button type="submit" variant="primary" loading={isPending}>
            {isPending
              ? t("pages.profile.actions.changing")
              : t("pages.profile.actions.changePassword")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
