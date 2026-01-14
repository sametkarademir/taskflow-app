import { z } from "zod";
import type { TFunction } from "i18next";

export const createUpdateUserSchemaFactory = (t: TFunction) =>
  z.object({
    phoneNumber: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, t("pages.users.forms.phoneNumber.errors.invalid"))
      .max(15, t("pages.users.forms.phoneNumber.errors.maxlength", { max: 15 }))
      .optional()
      .or(z.literal("")),
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
    emailConfirmed: z.boolean(),
    phoneNumberConfirmed: z.boolean(),
    twoFactorEnabled: z.boolean(),
  });

export type UpdateUserFormType = z.infer<
  ReturnType<typeof createUpdateUserSchemaFactory>
>;

export const DEFAULT_UPDATE_USER_FORM_VALUES: UpdateUserFormType = {
  phoneNumber: "",
  firstName: "",
  lastName: "",
  isActive: true,
  emailConfirmed: false,
  phoneNumberConfirmed: false,
  twoFactorEnabled: false,
};

