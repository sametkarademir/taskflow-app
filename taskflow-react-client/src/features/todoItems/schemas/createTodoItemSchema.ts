import { z } from "zod";
import type { TFunction } from "i18next";

export const createCreateTodoItemSchemaFactory = (t: TFunction) =>
  z.object({
    title: z
      .string()
      .min(1, t("pages.todoItems.forms.title.errors.required"))
      .max(256, t("pages.todoItems.forms.title.errors.maxlength", { max: 256 })),
    description: z
      .string()
      .max(5000, t("pages.todoItems.forms.description.errors.maxlength", { max: 5000 }))
      .optional()
      .or(z.literal("")),
    status: z.enum(["Backlog", "InProgress", "Blocked", "Completed"]),
    priority: z.enum(["Low", "Medium", "High"]),
    dueDate: z.string().optional().or(z.literal("")),
    categoryId: z
      .string()
      .min(1, t("pages.todoItems.forms.categoryId.errors.required")),
  });

export type CreateTodoItemFormType = z.infer<
  ReturnType<typeof createCreateTodoItemSchemaFactory>
>;

export const DEFAULT_CREATE_TODO_ITEM_FORM_VALUES: CreateTodoItemFormType = {
  title: "",
  description: "",
  status: "Backlog",
  priority: "Medium",
  dueDate: "",
  categoryId: "",
};
