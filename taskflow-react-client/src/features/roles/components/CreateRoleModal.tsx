import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLocale } from "../../../features/common/hooks/useLocale";
import { showToast } from "../../../features/common/helpers/toaster";
import { Modal } from "../../../components/ui/modal";
import { Input } from "../../../components/form/input";
import { Label } from "../../../components/form/label";
import { Button } from "../../../components/form/button";
import { useCreateRole } from "../hooks/useCreateRole";
import {
  createCreateRoleSchemaFactory,
  type CreateRoleFormType,
  DEFAULT_CREATE_ROLE_FORM_VALUES,
} from "../schemas/createRoleSchema";

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateRoleModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateRoleModalProps) => {
  const { t } = useLocale();
  const schema = createCreateRoleSchemaFactory(t);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateRoleFormType>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_CREATE_ROLE_FORM_VALUES,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const { mutate: createRole, isPending } = useCreateRole({
    onSuccess: () => {
      showToast(t("pages.roles.messages.createSuccess"), "success");
      reset();
      onClose();
      onSuccess?.();
    }
  });

  const onSubmit = (data: CreateRoleFormType) => {
    createRole({ params: data });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("pages.roles.modals.create.title")}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 my-4">
        {/* Role Name */}
        <div className="space-y-2">
          <Label
            htmlFor="name"
            isRequired
          >
            {t("pages.roles.forms.name.label")}
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder={t("pages.roles.forms.name.placeholder")}
            error={!!errors.name}
            hint={errors.name?.message}
            disabled={isPending}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            {t("pages.roles.forms.description.label")}
          </Label>
          <textarea
            id="description"
            {...register("description")}
            placeholder={t("pages.roles.forms.description.placeholder")}
            disabled={isPending}
            rows={4}
            className="w-full px-4 py-3.5 text-sm rounded-xl border-2 transition-all duration-200 bg-zinc-800/50 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-4 border-zinc-700 focus:border-[#6366f1] focus:ring-[#6366f1]/20 hover:border-zinc-600 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {errors.description && (
            <p className="mt-2 text-xs text-red-400">
              {errors.description.message}
            </p>
          )}
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
          <Button type="submit" variant="primary" loading={isPending}>
            {isPending
              ? t("pages.roles.actions.creating")
              : t("pages.roles.actions.create")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
