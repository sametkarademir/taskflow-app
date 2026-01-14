import { z } from "zod";
import type { TFunction } from "i18next";

export const createUpdateCategorySchemaFactory = (t: TFunction) =>
  z.object({
    name: z
      .string()
      .min(1, t("pages.categories.forms.name.errors.required"))
      .max(256, t("pages.categories.forms.name.errors.maxlength", { max: 256 })),
    description: z
      .string()
      .max(1024, t("pages.categories.forms.description.errors.maxlength", { max: 1024 }))
      .optional()
      .or(z.literal("")),
    colorHex: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6})$/, t("pages.categories.forms.colorHex.errors.invalidFormat"))
      .max(7, t("pages.categories.forms.colorHex.errors.maxlength", { max: 7 }))
      .optional()
      .or(z.literal("")),
  });

export type UpdateCategoryFormType = z.infer<
  ReturnType<typeof createUpdateCategorySchemaFactory>
>;

export const DEFAULT_UPDATE_CATEGORY_FORM_VALUES: UpdateCategoryFormType = {
  name: "",
  description: "",
  colorHex: "",
};
