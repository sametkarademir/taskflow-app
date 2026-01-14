import { z } from "zod";

export const createRegisterSchemaFactory = (
  t: (key: string, options?: Record<string, unknown>) => string,
) =>
  z
    .object({
      firstName: z
        .string()
        .min(1, t("pages.register.forms.firstName.errors.required"))
        .max(
          128,
          t("pages.register.forms.firstName.errors.maxlength", { max: 128 }),
        ),
      lastName: z
        .string()
        .min(1, t("pages.register.forms.lastName.errors.required"))
        .max(
          128,
          t("pages.register.forms.lastName.errors.maxlength", { max: 128 }),
        ),
      phoneNumber: z
        .string()
        .max(
          32,
          t("pages.register.forms.phoneNumber.errors.maxlength", { max: 32 }),
        )
        .optional(),
      email: z
        .string()
        .min(1, t("pages.register.forms.email.errors.required"))
        .email(t("pages.register.forms.email.errors.invalid"))
        .max(
          256,
          t("pages.register.forms.email.errors.maxlength", { max: 256 }),
        ),
      password: z
        .string()
        .min(1, t("pages.register.forms.password.errors.required"))
        .min(
          6,
          t("pages.register.forms.password.errors.minlength", { min: 6 }),
        ),
      confirmPassword: z
        .string()
        .min(1, t("pages.register.forms.confirmPassword.errors.required")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("pages.register.forms.confirmPassword.errors.match"),
      path: ["confirmPassword"],
    });

export type RegisterFormType = z.infer<
  ReturnType<typeof createRegisterSchemaFactory>
>;

export const DEFAULT_REGISTER_FORM_VALUES: RegisterFormType = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  password: "",
  confirmPassword: "",
};
