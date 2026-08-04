import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import de from "./locales/de.json";
import ru from "./locales/ru.json";
import zh from "./locales/zh.json";

import { DEFAULT_LANGUAGE, Language } from "./languages";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      [Language.EN]: {
        translation: en,
      },
      [Language.DE]: {
        translation: de,
      },
      [Language.RU]: {
        translation: ru,
      },
      [Language.ZH]: {
        translation: zh,
      },
    },

    fallbackLng: DEFAULT_LANGUAGE,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["navigator"],
      caches: [],
    },
  });

export default i18n;
