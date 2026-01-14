import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLocale } from "../../../features/common/hooks/useLocale";
import { showToast } from "../../../features/common/helpers/toaster";
import { Modal } from "../../../components/ui/modal";
import { Input } from "../../../components/form/input";
import { Label } from "../../../components/form/label";
import { Button } from "../../../components/form/button";
import { Switch } from "../../../components/form/switch";
import { useCreateUser } from "../hooks/useCreateUser";
import {
  createCreateUserSchemaFactory,
  type CreateUserFormType,
  DEFAULT_CREATE_USER_FORM_VALUES,
} from "../schemas/createUserSchema";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateUserModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateUserModalProps) => {
  const { t } = useLocale();
  const schema = createCreateUserSchemaFactory(t);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateUserFormType>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_CREATE_USER_FORM_VALUES,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const { mutate: createUser, isPending } = useCreateUser({
    onSuccess: () => {
      showToast(t("pages.users.messages.createSuccess"), "success");
      reset();
      onClose();
      onSuccess?.();
    },
  });

  const onSubmit = (data: CreateUserFormType) => {
    createUser({ params: data });
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
      title={t("pages.users.modals.create.title")}
      size="lg"
      className="max-h-[750px]"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 my-4">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" isRequired>
            {t("pages.users.forms.email.label")}
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder={t("pages.users.forms.email.placeholder")}
            error={!!errors.email}
            hint={errors.email?.message}
            disabled={isPending}
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" isRequired>
            {t("pages.users.forms.password.label")}
          </Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder={t("pages.users.forms.password.placeholder")}
            error={!!errors.password}
            hint={errors.password?.message}
            disabled={isPending}
          />
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" isRequired>
            {t("pages.users.forms.confirmPassword.label")}
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            placeholder={t("pages.users.forms.confirmPassword.placeholder")}
            error={!!errors.confirmPassword}
            hint={errors.confirmPassword?.message}
            disabled={isPending}
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
              ? t("pages.users.actions.creating")
              : t("pages.users.actions.create")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
