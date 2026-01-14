import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";

import { useLocale } from "../../common/hooks/useLocale";
import { useForgotPassword } from "../hooks/useForgotPassword";
import {
  createForgotPasswordSchemaFactory,
  DEFAULT_FORGOT_PASSWORD_FORM_VALUES,
  type ForgotPasswordFormType,
} from "../schemas/forgotPasswordSchema";

import { AuthFormHeader } from "./AuthFormHeader";
import { Input, Button, Label } from "../../../components/form";

interface ForgotPasswordFormProps {
  onSuccess: (email: string) => void;
}

export const ForgotPasswordForm = ({ onSuccess }: ForgotPasswordFormProps) => {
  const { t } = useLocale();
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const createForgotPasswordSchema = createForgotPasswordSchemaFactory(t);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(createForgotPasswordSchema),
    defaultValues: DEFAULT_FORGOT_PASSWORD_FORM_VALUES,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const onSubmit = async (data: ForgotPasswordFormType) => {
    forgotPassword(
      { params: data },
      {
        onSuccess: () => {
          onSuccess(data.email);
        },
      },
    );
  };

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute -inset-0.5 rounded-3xl bg-gradient-to-tr from-[#6366f1]/40 via-[#6366f1]/0 to-emerald-400/20 opacity-70 blur-2xl" />

      <div className="relative rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-6 md:p-8 shadow-[0_18px_45px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <AuthFormHeader
          title={t("pages.forgotPassword.labels.title")}
          description={t("pages.forgotPassword.labels.description")}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" isRequired>
              {t("pages.forgotPassword.forms.email.label")}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t("pages.forgotPassword.forms.email.placeholder")}
              error={!!errors.email}
              hint={errors.email?.message}
              {...register("email")}
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
            {t("pages.forgotPassword.actions.sendCode")}
          </Button>

          <p className="pt-2 text-center text-[13px] text-zinc-500">
            {t("pages.forgotPassword.labels.backToLogin")}{" "}
            <Link
              to="/login"
              className="font-medium text-[#6366f1] hover:text-[#8183ff] transition-colors inline-flex items-center gap-1 group"
            >
              {t("pages.forgotPassword.actions.login")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

