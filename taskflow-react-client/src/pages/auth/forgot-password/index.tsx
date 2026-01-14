import { useState } from "react";

import { ForgotPasswordForm } from "../../../features/auth/components/ForgotPasswordForm";
import { VerifyResetPasswordCodeForm } from "../../../features/auth/components/VerifyResetPasswordCodeForm";
import { ResetPasswordForm } from "../../../features/auth/components/ResetPasswordForm";

export const ForgotPasswordPage = () => {
  const [step, setStep] = useState<"forgot" | "verify" | "reset">("forgot");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const handleForgotPasswordSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setStep("verify");
  };

  const handleVerifySuccess = (userEmail: string, resetCode: string) => {
    setEmail(userEmail);
    setCode(resetCode);
    setStep("reset");
  };

  if (step === "verify") {
    return (
      <VerifyResetPasswordCodeForm
        email={email}
        onSuccess={handleVerifySuccess}
      />
    );
  }

  if (step === "reset") {
    return <ResetPasswordForm email={email} code={code} />;
  }

  return <ForgotPasswordForm onSuccess={handleForgotPasswordSuccess} />;
};

