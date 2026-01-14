import { useState } from "react";

import { RegisterForm } from "../../../features/auth/components/RegisterForm";
import { ConfirmEmailForm } from "../../../features/auth/components/ConfirmEmailForm";

export const RegisterPage = () => {
  const [showConfirmEmailForm, setShowConfirmEmailForm] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleRegisterSuccess = (email: string) => {
    setRegisteredEmail(email);
    setShowConfirmEmailForm(true);
  };

  if (showConfirmEmailForm) {
    return <ConfirmEmailForm email={registeredEmail} />;
  }

  return <RegisterForm onRegisterSuccess={handleRegisterSuccess} />;
};

