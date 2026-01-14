import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import { useLocale } from "../../../features/common/hooks/useLocale";
import { isAuthenticated } from "../../../features/common/helpers/cookie";
import { useLogin } from "../../../features/auth/hooks/useLogin";
import {
  createLoginSchemaFactory,
  DEFAULT_LOGIN_FORM_VALUES,
  type LoginFormType,
} from "../../../features/auth/schemas/loginSchema";
import { AuthFormHeader } from "../../../features/auth/components/AuthFormHeader";
import { Input, Button, Label } from "../../../components/form";

export const LoginPage = () => {
  const { t } = useLocale();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const createLoginSchema = createLoginSchemaFactory(t);
  const { mutate: userLogin, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    resolver: zodResolver(createLoginSchema),
    defaultValues: DEFAULT_LOGIN_FORM_VALUES,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const onSubmit = async (data: LoginFormType) => {
    userLogin(
      { params: data },
      {
        onSuccess: () => {
          navigate("/", { replace: true });
        },
        onError: () => {},
      },
    );
  };

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute -inset-0.5 rounded-3xl bg-gradient-to-tr from-[#6366f1]/40 via-[#6366f1]/0 to-emerald-400/20 opacity-70 blur-2xl" />

      <div className="relative rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-6 md:p-8 shadow-[0_18px_45px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <AuthFormHeader
          title={t("pages.login.labels.title")}
          description={t("pages.login.labels.description")}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">
              {t("pages.login.forms.email.label")}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t("pages.login.forms.email.placeholder")}
              error={!!errors.email}
              hint={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {t("pages.login.forms.password.label")}
            </Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("pages.login.forms.password.placeholder")}
              error={!!errors.password}
              hint={errors.password?.message}
              {...register("password")}
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

          <div className="flex items-center justify-end gap-3 text-xs">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-[#6366f1] hover:text-[#8183ff] transition-colors"
            >
              {t("pages.login.actions.forgotPassword")}
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            disabled={isSubmitting || isPending}
            loading={isSubmitting || isPending}
          >
            {t("pages.login.actions.login")}
          </Button>

          <p className="pt-2 text-center text-[13px] text-zinc-500">
            {t("pages.login.labels.registerText")}{" "}
            <Link
              to="/register"
              className="font-medium text-[#6366f1] hover:text-[#8183ff] transition-colors"
            >
              {t("pages.login.actions.register")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};


