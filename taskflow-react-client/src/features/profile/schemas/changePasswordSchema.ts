import { z } from "zod";
import type { TFunction } from "i18next";

export const createChangePasswordSchemaFactory = (t: TFunction) =>
  z
    .object({
      oldPassword: z
        .string()
        .min(1, t("validation.oldPassword.required"))
        .min(8, t("validation.password.minLength", { min: 8 }))
        .max(32, t("validation.password.maxLength", { max: 32 })),
      newPassword: z
        .string()
        .min(1, t("validation.newPassword.required"))
        .min(8, t("validation.password.minLength", { min: 8 }))
        .max(32, t("validation.password.maxLength", { max: 32 })),
      confirmNewPassword: z
        .string()
        .min(1, t("validation.confirmPassword.required")),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: t("validation.confirmPassword.mismatch"),
      path: ["confirmNewPassword"],
    });

export type ChangePasswordFormType = z.infer<
  ReturnType<typeof createChangePasswordSchemaFactory>
>;

export const DEFAULT_CHANGE_PASSWORD_FORM_VALUES: ChangePasswordFormType = {
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

