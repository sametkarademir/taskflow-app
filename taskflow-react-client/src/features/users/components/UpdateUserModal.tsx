import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLocale } from "../../../features/common/hooks/useLocale";
import { showToast } from "../../../features/common/helpers/toaster";
import { Modal } from "../../../components/ui/modal";
import { Input } from "../../../components/form/input";
import { Label } from "../../../components/form/label";
import { Button } from "../../../components/form/button";
import { Switch } from "../../../components/form/switch";
import { useGetUserById } from "../hooks/useGetUserById";
import { useUpdateUser } from "../hooks/useUpdateUser";
import {
  createUpdateUserSchemaFactory,
  type UpdateUserFormType,
  DEFAULT_UPDATE_USER_FORM_VALUES,
} from "../schemas/updateUserSchema";

interface UpdateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  userId: string | null;
}

export const UpdateUserModal = ({
  isOpen,
  onClose,
  onSuccess,
  userId,
}: UpdateUserModalProps) => {
  const { t } = useLocale();
  const schema = createUpdateUserSchemaFactory(t);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<UpdateUserFormType>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_UPDATE_USER_FORM_VALUES,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  // Fetch user data when modal opens
  const { data: userData, isLoading: isLoadingUser } = useGetUserById(
    userId || "",
    {
      enabled: isOpen && !!userId,
    }
  );

  // Update form values when user data is loaded
  useEffect(() => {
    if (userData && isOpen) {
      reset({
        phoneNumber: userData.phoneNumber || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        isActive: userData.isActive,
        emailConfirmed: userData.emailConfirmed,
        phoneNumberConfirmed: userData.phoneNumberConfirmed,
        twoFactorEnabled: userData.twoFactorEnabled,
      });
    }
  }, [userData, isOpen, reset]);

  const { mutate: updateUser, isPending } = useUpdateUser({
    onSuccess: () => {
      showToast(t("pages.users.messages.updateSuccess"), "success");
      reset();
      onClose();
      onSuccess?.();
    },
  });

  const onSubmit = (data: UpdateUserFormType) => {
    if (!userId) return;
    updateUser({ id: userId, data });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const emailConfirmed = watch("emailConfirmed");
  const phoneNumberConfirmed = watch("phoneNumberConfirmed");
  const twoFactorEnabled = watch("twoFactorEnabled");
  const isActive = watch("isActive");

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("pages.users.modals.update.title")}
      size="lg"
    >
      {isLoadingUser ? (
        <div className="flex items-center justify-center py-12">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full blur opacity-20 animate-pulse"></div>
            <div className="relative animate-spin rounded-full h-12 w-12 border-2 border-[#6366f1] border-t-transparent"></div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 my-4">
          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email">
              {t("pages.users.forms.email.label")}
            </Label>
            <Input
              id="email"
              type="email"
              value={userData?.email || ""}
              disabled
              className="opacity-50 cursor-not-allowed"
            />
          </div>

          {/* First Name and Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                {t("pages.users.forms.firstName.label")}
              </Label>
              <Input
                id="firstName"
                {...register("firstName")}
                placeholder={t("pages.users.forms.firstName.placeholder")}
                error={!!errors.firstName}
                hint={errors.firstName?.message}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                {t("pages.users.forms.lastName.label")}
              </Label>
              <Input
                id="lastName"
                {...register("lastName")}
                placeholder={t("pages.users.forms.lastName.placeholder")}
                error={!!errors.lastName}
                hint={errors.lastName?.message}
                disabled={isPending}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">
              {t("pages.users.forms.phoneNumber.label")}
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              {...register("phoneNumber")}
              placeholder={t("pages.users.forms.phoneNumber.placeholder")}
              error={!!errors.phoneNumber}
              hint={errors.phoneNumber?.message}
              disabled={isPending}
            />
          </div>

          {/* Switches */}
          <div className="space-y-4 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/50">
            <Switch
              id="isActive"
              checked={isActive}
              onChange={(e) => setValue("isActive", e.target.checked)}
              label={t("pages.users.forms.isActive.label")}
              disabled={isPending}
            />
            <Switch
              id="emailConfirmed"
              checked={emailConfirmed}
              onChange={(e) => setValue("emailConfirmed", e.target.checked)}
              label={t("pages.users.forms.emailConfirmed.label")}
              disabled={isPending}
            />
            <Switch
              id="phoneNumberConfirmed"
              checked={phoneNumberConfirmed}
              onChange={(e) => setValue("phoneNumberConfirmed", e.target.checked)}
              label={t("pages.users.forms.phoneNumberConfirmed.label")}
              disabled={isPending}
            />
            <Switch
              id="twoFactorEnabled"
              checked={twoFactorEnabled}
              onChange={(e) => setValue("twoFactorEnabled", e.target.checked)}
              label={t("pages.users.forms.twoFactorEnabled.label")}
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
                ? t("pages.users.actions.updating")
                : t("pages.users.actions.update")}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
