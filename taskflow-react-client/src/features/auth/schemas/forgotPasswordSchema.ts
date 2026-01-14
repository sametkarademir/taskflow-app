import { z } from "zod";

export const createForgotPasswordSchemaFactory = (
  t: (key: string, options?: Record<string, unknown>) => string,
) =>
  z.object({
    email: z
      .string()
      .min(1, t("pages.forgotPassword.forms.email.errors.required"))
      .email(t("pages.forgotPassword.forms.email.errors.invalid")),
  });

export type ForgotPasswordFormType = z.infer<
  ReturnType<typeof createForgotPasswordSchemaFactory>
>;

export const DEFAULT_FORGOT_PASSWORD_FORM_VALUES: ForgotPasswordFormType = {
  email: "",
};
