import { z } from "zod";

export const createConfirmEmailSchemaFactory = (
  t: (key: string, options?: Record<string, unknown>) => string,
) =>
  z.object({
    email: z
      .string()
      .min(1, t("pages.confirmEmail.forms.email.errors.required"))
      .email(t("pages.confirmEmail.forms.email.errors.invalid"))
      .max(
        256,
        t("pages.confirmEmail.forms.email.errors.maxlength", { max: 256 }),
      ),
    code: z
      .string()
      .min(1, t("pages.confirmEmail.forms.code.errors.required"))
      .length(
        6,
        t("pages.confirmEmail.forms.code.errors.length", { length: 6 }),
      )
      .regex(/^\d{6}$/, t("pages.confirmEmail.forms.code.errors.numeric")),
  });

export type ConfirmEmailFormType = z.infer<
  ReturnType<typeof createConfirmEmailSchemaFactory>
>;
