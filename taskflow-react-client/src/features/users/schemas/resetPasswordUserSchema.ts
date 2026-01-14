import { z } from "zod";
import type { TFunction } from "i18next";

export const createResetPasswordUserSchemaFactory = (t: TFunction) =>
  z
    .object({
      newPassword: z
        .string()
        .min(6, t("pages.users.forms.password.errors.minlength", { min: 6 }))
        .max(128, t("pages.users.forms.password.errors.maxlength", { max: 128 })),
      confirmNewPassword: z
        .string()
        .min(1, t("pages.users.forms.confirmPassword.errors.required")),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: t("pages.users.forms.confirmPassword.errors.mismatch"),
      path: ["confirmNewPassword"],
    });

export type ResetPasswordUserFormType = z.infer<
  ReturnType<typeof createResetPasswordUserSchemaFactory>
>;

export const DEFAULT_RESET_PASSWORD_USER_FORM_VALUES: ResetPasswordUserFormType =
  {
    newPassword: "",
    confirmNewPassword: "",
  };

