import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translateEN from "./assets/locales/en/translation.json";
import translateTR from "./assets/locales/tr/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: translateEN,
      },
      tr: {
        translation: translateTR,
      },
    },
    supportedLngs: ["en", "tr"],
    fallbackLng: ["en", "tr"],
    nonExplicitSupportedLngs: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;
