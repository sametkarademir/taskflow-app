import { z } from "zod";
import type { TFunction } from "i18next";

export const createCreateUserSchemaFactory = (t: TFunction) =>
  z
    .object({
      email: z
        .string()
        .min(1, t("pages.users.forms.email.errors.required"))
        .email(t("pages.users.forms.email.errors.invalid"))
        .max(256, t("pages.users.forms.email.errors.maxlength", { max: 256 })),
      emailConfirmed: z.boolean(),
      phoneNumber: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, t("pages.users.forms.phoneNumber.errors.invalid"))
        .max(15, t("pages.users.forms.phoneNumber.errors.maxlength", { max: 15 }))
        .optional()
        .or(z.literal("")),
      phoneNumberConfirmed: z.boolean(),
      twoFactorEnabled: z.boolean(),
      firstName: z
        .string()
        .max(50, t("pages.users.forms.firstName.errors.maxlength", { max: 50 }))
        .optional()
        .or(z.literal("")),
      lastName: z
        .string()
        .max(50, t("pages.users.forms.lastName.errors.maxlength", { max: 50 }))
        .optional()
        .or(z.literal("")),
      isActive: z.boolean(),
      password: z
        .string()
        .min(6, t("pages.users.forms.password.errors.minlength", { min: 6 }))
        .max(128, t("pages.users.forms.password.errors.maxlength", { max: 128 })),
      confirmPassword: z
        .string()
        .min(1, t("pages.users.forms.confirmPassword.errors.required")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("pages.users.forms.confirmPassword.errors.mismatch"),
      path: ["confirmPassword"],
    });

export type CreateUserFormType = z.infer<
  ReturnType<typeof createCreateUserSchemaFactory>
>;

export const DEFAULT_CREATE_USER_FORM_VALUES: CreateUserFormType = {
  email: "",
  emailConfirmed: false,
  phoneNumber: "",
  phoneNumberConfirmed: false,
  twoFactorEnabled: false,
  firstName: "",
  lastName: "",
  isActive: true,
  password: "",
  confirmPassword: "",
};

