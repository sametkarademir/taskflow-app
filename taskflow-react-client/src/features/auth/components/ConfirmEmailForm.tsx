import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useLocale } from "../../common/hooks/useLocale";
import { showToast } from "../../common/helpers/toaster";
import { useConfirmEmail } from "../hooks/useConfirmEmail";
import { useResendEmailConfirmation } from "../hooks/useResendEmailConfirmation";
import { createConfirmEmailSchemaFactory, type ConfirmEmailFormType } from "../schemas/confirmEmailSchema";

import { AuthFormHeader } from "./AuthFormHeader";
import { Input, Button, Label } from "../../../components/form";
import { Alert } from "../../../components/ui/alert";

interface ConfirmEmailFormProps {
  email: string;
}

const MAX_ATTEMPTS = 3;

export const ConfirmEmailForm = ({ email }: ConfirmEmailFormProps) => {
  const { t } = useLocale();
  const navigate = useNavigate();
  const attemptCount = useRef(0);
  const [remainingAttempts, setRemainingAttempts] = useState(MAX_ATTEMPTS);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createConfirmEmailSchema = createConfirmEmailSchemaFactory(t);
  const { mutate: confirmEmail } = useConfirmEmail();
  const { mutate: resendEmailConfirmation, isPending: isResending } = useResendEmailConfirmation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmEmailFormType>({
    resolver: zodResolver(createConfirmEmailSchema),
    defaultValues: {
      code: "",
      email: email,
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const onSubmit = async (data: ConfirmEmailFormType) => {
    setErrorMessage(null);
    confirmEmail(
      { params: data },
      {
        onSuccess: () => {
          showToast(t("pages.confirmEmail.messages.success"), "success");
          navigate("/login", { replace: true });
        },
        onError: () => {
          attemptCount.current += 1;
          const remaining = MAX_ATTEMPTS - attemptCount.current;
          setRemainingAttempts(remaining);

          if (remaining === 0) {
            setErrorMessage(t("pages.confirmEmail.messages.noAttemptsLeft"));
          } else {
            setErrorMessage(
              t("pages.confirmEmail.messages.invalidCode", {
                remaining: remaining,
              }),
            );
          }
        },
      },
    );
  };

  const handleResendCode = () => {
    resendEmailConfirmation(
      { email },
      {
        onSuccess: () => {
          attemptCount.current = 0;
          setRemainingAttempts(MAX_ATTEMPTS);
          setErrorMessage(null);
          reset({
            code: "",
            email: email,
          });
          showToast(t("pages.confirmEmail.messages.resendSuccess"), "success");
        }
      },
    );
  };

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute -inset-0.5 rounded-3xl bg-gradient-to-tr from-[#6366f1]/40 via-[#6366f1]/0 to-emerald-400/20 opacity-70 blur-2xl" />

      <div className="relative rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-6 md:p-8 shadow-[0_18px_45px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <AuthFormHeader
          title={t("pages.confirmEmail.labels.title")}
          description={t("pages.confirmEmail.labels.description", {
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

        <form onSubmit={(e) => {
          if (remainingAttempts === 0) {
            e.preventDefault();
          } else {
            handleSubmit(onSubmit)(e);
          }
        }}
          className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code">
              {t("pages.confirmEmail.forms.code.label")}
            </Label>
            <Input
              id="code"
              type="text"
              placeholder={t("pages.confirmEmail.forms.code.placeholder")}
              error={!!errors.code}
              hint={errors.code?.message}
              {...register("code", {
                onChange: (e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setValue("code", value, { shouldValidate: true });
                  // Input değiştiğinde sadece error mesajını temizle, deneme sayısını koru
                  if (errorMessage) {
                    setErrorMessage(null);
                  }
                },
              })}
              maxLength={6}
              disabled={isSubmitting || remainingAttempts === 0}
              className="text-center text-2xl tracking-widest font-semibold"
            />
            <p className="text-xs text-zinc-500 text-center">
              {t("pages.confirmEmail.forms.code.hint")}
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            className="mt-2"
            loading={isSubmitting}
            disabled={isSubmitting || remainingAttempts === 0}
          >
            {t("pages.confirmEmail.actions.verify")}
          </Button>

          <p className="pt-2 text-center text-[13px] text-zinc-500">
            {t("pages.confirmEmail.labels.resendText")}{" "}
            <button
              type="button"
              onClick={handleResendCode}
              className="font-medium text-[#6366f1] hover:text-[#8183ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || isResending}
            >
              {t("pages.confirmEmail.actions.resend")}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

