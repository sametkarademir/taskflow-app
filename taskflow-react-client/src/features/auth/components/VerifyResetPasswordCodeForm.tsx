import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLocale } from "../../common/hooks/useLocale";
import { useVerifyResetPasswordCode } from "../hooks/useVerifyResetPasswordCode";
import {
  createVerifyResetPasswordCodeSchemaFactory,
  DEFAULT_VERIFY_RESET_PASSWORD_CODE_FORM_VALUES,
  type VerifyResetPasswordCodeFormType,
} from "../schemas/verifyResetPasswordCodeSchema";

import { AuthFormHeader } from "./AuthFormHeader";
import { Input, Button, Label } from "../../../components/form";
import { Alert } from "../../../components/ui/alert";

interface VerifyResetPasswordCodeFormProps {
  email: string;
  onSuccess: (email: string, code: string) => void;
}

const MAX_ATTEMPTS = 3;

export const VerifyResetPasswordCodeForm = ({
  email,
  onSuccess,
}: VerifyResetPasswordCodeFormProps) => {
  const { t } = useLocale();
  const attemptCount = useRef(0);
  const [remainingAttempts, setRemainingAttempts] = useState(MAX_ATTEMPTS);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createVerifyResetPasswordCodeSchema =
    createVerifyResetPasswordCodeSchemaFactory(t);
  const { mutate: verifyResetPasswordCode, isPending } =
    useVerifyResetPasswordCode();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VerifyResetPasswordCodeFormType>({
    resolver: zodResolver(createVerifyResetPasswordCodeSchema),
    defaultValues: {
      ...DEFAULT_VERIFY_RESET_PASSWORD_CODE_FORM_VALUES,
      email: email,
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const onSubmit = async (data: VerifyResetPasswordCodeFormType) => {
    setErrorMessage(null);
    verifyResetPasswordCode(
      { params: data },
      {
        onSuccess: () => {
          onSuccess(data.email, data.code);
        },
        onError: () => {
          attemptCount.current += 1;
          const remaining = MAX_ATTEMPTS - attemptCount.current;
          setRemainingAttempts(remaining);

          if (remaining === 0) {
            setErrorMessage(t("pages.verifyResetCode.messages.noAttemptsLeft"));
          } else {
            setErrorMessage(
              t("pages.verifyResetCode.messages.invalidCode", {
                remaining: remaining,
              }),
            );
          }
        },
      },
    );
  };

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute -inset-0.5 rounded-3xl bg-gradient-to-tr from-[#6366f1]/40 via-[#6366f1]/0 to-emerald-400/20 opacity-70 blur-2xl" />

      <div className="relative rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-6 md:p-8 shadow-[0_18px_45px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <AuthFormHeader
          title={t("pages.verifyResetCode.labels.title")}
          description={t("pages.verifyResetCode.labels.description", {
            email,
          })}
        />

        {errorMessage && (
          <Alert
            variant="error"
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
          />
        )}

        <form
          onSubmit={(e) => {
            if (remainingAttempts === 0) {
              e.preventDefault();
            } else {
              handleSubmit(onSubmit)(e);
            }
          }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="code">
              {t("pages.verifyResetCode.forms.code.label")}
            </Label>
            <Input
              id="code"
              type="text"
              placeholder={t("pages.verifyResetCode.forms.code.placeholder")}
              error={!!errors.code}
              hint={errors.code?.message}
              {...register("code", {
                onChange: (e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setValue("code", value, { shouldValidate: true });
                  if (errorMessage) {
                    setErrorMessage(null);
                  }
                },
              })}
              maxLength={6}
              disabled={isSubmitting || isPending || remainingAttempts === 0}
              className="text-center text-2xl tracking-widest font-semibold"
            />
            <p className="text-xs text-zinc-500 text-center">
              {t("pages.verifyResetCode.forms.code.hint")}
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            className="mt-2"
            loading={isSubmitting || isPending}
            disabled={isSubmitting || isPending || remainingAttempts === 0}
          >
            {t("pages.verifyResetCode.actions.verify")}
          </Button>
        </form>
      </div>
    </div>
  );
};

