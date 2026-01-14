import { z } from "zod";
import type { TFunction } from "i18next";

export const createCreateTodoCommentSchemaFactory = (t: TFunction) =>
  z.object({
    content: z
      .string()
      .min(1, t("pages.todoComments.forms.content.errors.required"))
      .max(5000, t("pages.todoComments.forms.content.errors.maxlength", { max: 5000 })),
  });

export type CreateTodoCommentFormType = z.infer<
  ReturnType<typeof createCreateTodoCommentSchemaFactory>
>;

export const DEFAULT_CREATE_TODO_COMMENT_FORM_VALUES: CreateTodoCommentFormType = {
  content: "",
};
