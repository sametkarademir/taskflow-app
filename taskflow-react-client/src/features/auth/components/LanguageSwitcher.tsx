import { useLocale } from "../../common/hooks/useLocale";

export const LanguageSwitcher = () => {
  const { changeLanguage, supportedLanguages, locale } = useLocale();

  return (
    <div className="flex items-center gap-1 rounded-full bg-zinc-900/80 border border-zinc-800 px-1.5 py-1">
      {supportedLanguages?.map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => changeLanguage(lng)}
          className={`px-2 py-0.5 text-[11px] font-medium rounded-full transition-colors ${
            locale === lng
              ? "bg-[#6366f1] text-white"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

