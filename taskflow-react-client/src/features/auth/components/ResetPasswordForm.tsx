import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, ArrowRight } from "lucide-react";

import { showToast } from "../../common/helpers/toaster";
import { useLocale } from "../../common/hooks/useLocale";
import { useResetPassword } from "../hooks/useResetPassword";
import {
  createResetPasswordSchemaFactory,
  DEFAULT_RESET_PASSWORD_FORM_VALUES,
  type ResetPasswordFormType,
} from "../schemas/resetPasswordSchema";

import { AuthFormHeader } from "./AuthFormHeader";
import { Input, Button, Label } from "../../../components/form";

interface ResetPasswordFormProps {
  email: string;
  code: string;
}

export const ResetPasswordForm = ({
  email,
  code,
}: ResetPasswordFormProps) => {
  const { t } = useLocale();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const createResetPasswordSchema = createResetPasswordSchemaFactory(t);
  const { mutate: resetPassword, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormType>({
    resolver: zodResolver(createResetPasswordSchema),
    defaultValues: {
      ...DEFAULT_RESET_PASSWORD_FORM_VALUES,
      email: email,
      code: code,
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const onSubmit = async (data: ResetPasswordFormType) => {
    resetPassword(
      { params: data },
      {
        onSuccess: () => {
          showToast(t("pages.resetPassword.messages.success"), "success");
          navigate("/login", { replace: true });
        },
      },
    );
  };

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute -inset-0.5 rounded-3xl bg-gradient-to-tr from-[#6366f1]/40 via-[#6366f1]/0 to-emerald-400/20 opacity-70 blur-2xl" />

      <div className="relative rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-6 md:p-8 shadow-[0_18px_45px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <AuthFormHeader
          title={t("pages.resetPassword.labels.title")}
          description={t("pages.resetPassword.labels.description")}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="newPassword" isRequired>
              <Lock className="w-4 h-4 text-[#6366f1]" />
              {t("pages.resetPassword.forms.newPassword.label")}
            </Label>
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder={t("pages.resetPassword.forms.newPassword.placeholder")}
              error={!!errors.newPassword}
              hint={errors.newPassword?.message}
              {...register("newPassword")}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword" isRequired>
              <Lock className="w-4 h-4 text-[#6366f1]" />
              {t("pages.resetPassword.forms.confirmNewPassword.label")}
            </Label>
            <Input
              id="confirmNewPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t(
                "pages.resetPassword.forms.confirmNewPassword.placeholder",
              )}
              error={!!errors.confirmNewPassword}
              hint={errors.confirmNewPassword?.message}
              {...register("confirmNewPassword")}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            className="mt-2"
            disabled={isSubmitting || isPending}
            loading={isSubmitting || isPending}
          >
            {t("pages.resetPassword.actions.reset")}
          </Button>

          <p className="pt-2 text-center text-[13px] text-zinc-500">
            {t("pages.resetPassword.labels.backToLogin")}{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-medium text-[#6366f1] hover:text-[#8183ff] transition-colors inline-flex items-center gap-1 group"
            >
              {t("pages.resetPassword.actions.login")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

