import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enUS from "./locales/en-US.json";
import deDE from "./locales/de-DE.json";
import ruRU from "./locales/ru-RU.json";
import zhCN from "./locales/zh-CN.json";
import arSA from "./locales/ar-SA.json";

import { DEFAULT_LANGUAGE, Language } from "./languages";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      [Language.EN_US]: {
        translation: enUS,
      },
      [Language.DE_DE]: {
        translation: deDE,
      },
      [Language.RU_RU]: {
        translation: ruRU,
      },
      [Language.ZH_CN]: {
        translation: zhCN,
      },
      [Language.AR_SA]: {
        translation: arSA,
      },
    },

    supportedLngs: [
      Language.EN_US,
      Language.DE_DE,
      Language.RU_RU,
      Language.ZH_CN,
      Language.AR_SA,
    ],

    fallbackLng: DEFAULT_LANGUAGE,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["navigator"],
      caches: [],
    },
  });

const updateDocumentDirection = (language: string) => {
  const isRTL = language.startsWith("ar");

  document.documentElement.lang = language;
  document.documentElement.dir = isRTL ? "rtl" : "ltr";
};

// Set on initial load
updateDocumentDirection(i18n.resolvedLanguage ?? i18n.language);

// Update whenever the language changes
i18n.on("languageChanged", updateDocumentDirection);

export default i18n;