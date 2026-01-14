import { useTranslation } from "react-i18next";
import { tr, enUS } from "date-fns/locale";

export const useLocale = () => {
  const { t: translate, i18n } = useTranslation();
  const locale = i18n.language;
  const dateLocale = getDateLocale();

  function getDateLocale() {
    switch (locale) {
      case "en": {
        return enUS;
      }
      case "tr":
      default: {
        return tr;
      }
    }
  }

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return {
    t: translate,
    locale,
    dateLocale,
    changeLanguage,
    isLoading: !i18n.isInitialized,
    supportedLanguages: (i18n.options.supportedLngs || ["en", "tr"]).filter(
      (lng) => lng !== "cimode" && lng !== "CIMODE",
    ),
  };
};
