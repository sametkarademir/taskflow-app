import { z } from "zod";
import type { TFunction } from "i18next";

export const createCreateRoleSchemaFactory = (t: TFunction) =>
  z.object({
    name: z
      .string()
      .min(1, t("pages.roles.forms.name.errors.required"))
      .max(256, t("pages.roles.forms.name.errors.maxlength", { max: 256 })),
    description: z
      .string()
      .max(
        1024,
        t("pages.roles.forms.description.errors.maxlength", { max: 1024 }),
      )
      .optional(),
  });

export type CreateRoleFormType = z.infer<
  ReturnType<typeof createCreateRoleSchemaFactory>
>;

export const DEFAULT_CREATE_ROLE_FORM_VALUES: CreateRoleFormType = {
  name: "",
  description: "",
};
