import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useLocale } from "../../common/hooks/useLocale";
import { useRegister } from "../hooks/useRegister";
import { createRegisterSchemaFactory, DEFAULT_REGISTER_FORM_VALUES, type RegisterFormType } from "../schemas/registerSchema";

import { AuthFormHeader } from "./AuthFormHeader";
import { Input, Button, Label } from "../../../components/form";

interface RegisterFormProps {
  onRegisterSuccess: (email: string) => void;
}

export const RegisterForm = ({ onRegisterSuccess }: RegisterFormProps) => {
  const { t } = useLocale();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const createRegisterSchema = createRegisterSchemaFactory(t);
  const { mutate: userRegister } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createRegisterSchema),
    defaultValues: DEFAULT_REGISTER_FORM_VALUES,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const onSubmit = async (data: RegisterFormType) => {
    userRegister(
      { params: data },
      {
        onSuccess: () => {
          onRegisterSuccess(data.email);
        },
        onError: () => {
        },
      },
    );
  };

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute -inset-0.5 rounded-3xl bg-gradient-to-tr from-[#6366f1]/40 via-[#6366f1]/0 to-emerald-400/20 opacity-70 blur-2xl" />

      <div className="relative rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-6 md:p-8 shadow-[0_18px_45px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <AuthFormHeader
          title={t("pages.register.labels.title")}
          description={t("pages.register.labels.description")}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName" isRequired>
                {t("pages.register.forms.firstName.label")}
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder={t("pages.register.forms.firstName.placeholder")}
                error={!!errors.firstName}
                hint={errors.firstName?.message}
                {...register("firstName")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" isRequired>
                {t("pages.register.forms.lastName.label")}
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder={t("pages.register.forms.lastName.placeholder")}
                error={!!errors.lastName}
                hint={errors.lastName?.message}
                {...register("lastName")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">
              {t("pages.register.forms.phoneNumber.label")}
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder={t("pages.register.forms.phoneNumber.placeholder")}
              error={!!errors.phoneNumber}
              hint={errors.phoneNumber?.message}
              {...register("phoneNumber")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" isRequired>
              {t("pages.register.forms.email.label")}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t("pages.register.forms.email.placeholder")}
              error={!!errors.email}
              hint={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" isRequired>
              {t("pages.register.forms.password.label")}
            </Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("pages.register.forms.password.placeholder")}
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" isRequired>
              {t("pages.register.forms.confirmPassword.label")}
            </Label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("pages.register.forms.confirmPassword.placeholder")}
              error={!!errors.confirmPassword}
              hint={errors.confirmPassword?.message}
              {...register("confirmPassword")}
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
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {t("pages.register.actions.register")}
          </Button>

          <p className="pt-2 text-center text-[13px] text-zinc-500">
            {t("pages.register.labels.loginText")}{" "}
            <Link
              to="/login"
              className="font-medium text-[#6366f1] hover:text-[#8183ff] transition-colors"
            >
              {t("pages.register.actions.login")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

