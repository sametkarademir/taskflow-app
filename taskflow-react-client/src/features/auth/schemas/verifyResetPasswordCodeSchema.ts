import { z } from "zod";

export const createVerifyResetPasswordCodeSchemaFactory = (
  t: (key: string, options?: Record<string, unknown>) => string,
) =>
  z.object({
    email: z
      .string()
      .min(1, t("pages.verifyResetCode.forms.email.errors.required"))
      .email(t("pages.verifyResetCode.forms.email.errors.invalid"))
      .max(
        256,
        t("pages.verifyResetCode.forms.email.errors.maxlength", { max: 256 }),
      ),
    code: z
      .string()
      .min(1, t("pages.verifyResetCode.forms.code.errors.required"))
      .length(
        6,
        t("pages.verifyResetCode.forms.code.errors.length", { length: 6 }),
      )
      .regex(/^\d{6}$/, t("pages.verifyResetCode.forms.code.errors.numeric")),
  });

export type VerifyResetPasswordCodeFormType = z.infer<
  ReturnType<typeof createVerifyResetPasswordCodeSchemaFactory>
>;

export const DEFAULT_VERIFY_RESET_PASSWORD_CODE_FORM_VALUES: VerifyResetPasswordCodeFormType =
  {
    email: "",
    code: "",
  };

