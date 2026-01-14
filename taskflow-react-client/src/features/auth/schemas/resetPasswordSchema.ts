import { z } from "zod";

export const createResetPasswordSchemaFactory = (
  t: (key: string, options?: Record<string, unknown>) => string,
) =>
  z
    .object({
      code: z
        .string()
        .min(1, t("pages.verifyResetCode.forms.code.errors.required"))
        .length(
          6,
          t("pages.verifyResetCode.forms.code.errors.length", { length: 6 }),
        )
        .regex(/^\d{6}$/, t("pages.verifyResetCode.forms.code.errors.numeric")),
      email: z
        .string()
        .min(1, t("pages.resetPassword.forms.email.errors.required"))
        .email(t("pages.resetPassword.forms.email.errors.invalid"))
        .max(
          256,
          t("pages.resetPassword.forms.email.errors.maxlength", { max: 256 }),
        ),
      newPassword: z
        .string()
        .min(1, t("pages.resetPassword.forms.newPassword.errors.required"))
        .min(
          6,
          t("pages.resetPassword.forms.newPassword.errors.minlength", {
            min: 6,
          }),
        )
        .max(
          16,
          t("pages.resetPassword.forms.newPassword.errors.maxlength", {
            max: 16,
          }),
        ),
      confirmNewPassword: z
        .string()
        .min(
          1,
          t("pages.resetPassword.forms.confirmNewPassword.errors.required"),
        ),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: t("pages.resetPassword.forms.confirmNewPassword.errors.match"),
      path: ["confirmNewPassword"],
    });

export type ResetPasswordFormType = z.infer<
  ReturnType<typeof createResetPasswordSchemaFactory>
>;

export const DEFAULT_RESET_PASSWORD_FORM_VALUES: ResetPasswordFormType = {
  code: "",
  email: "",
  newPassword: "",
  confirmNewPassword: "",
};
