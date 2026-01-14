import { LanguageSwitcher } from "./LanguageSwitcher";

interface AuthFormHeaderProps {
  title: string;
  description: string;
}

export const AuthFormHeader = ({ title, description }: AuthFormHeaderProps) => {
  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold text-zinc-50">{title}</h2>
        <p className="mt-1 text-xs text-zinc-500">{description}</p>
      </div>

      <LanguageSwitcher />
    </div>
  );
};

