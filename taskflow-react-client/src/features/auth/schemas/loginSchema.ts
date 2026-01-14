import { z } from "zod";

export const createLoginSchemaFactory = (
  t: (key: string, options?: Record<string, unknown>) => string,
) =>
  z.object({
    email: z
      .string()
      .min(1, t("pages.login.forms.email.errors.required"))
      .max(256, t("pages.login.forms.email.errors.maxlength", { max: 256 }))
      .email(t("pages.login.forms.email.errors.invalid")),
    password: z
      .string()
      .min(1, t("pages.login.forms.password.errors.required"))
      .min(6, t("pages.login.forms.password.errors.minlength", { min: 6 }))
      .max(16, t("pages.login.forms.password.errors.maxlength", { max: 16 })),
  });

export type LoginFormType = z.infer<
  ReturnType<typeof createLoginSchemaFactory>
>;

export const DEFAULT_LOGIN_FORM_VALUES: LoginFormType = {
  email: "",
  password: "",
};
