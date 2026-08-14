import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enUS from "./locales/en-US.json";
import deDE from "./locales/de-DE.json";
import ruRU from "./locales/ru-RU.json";
import zhCN from "./locales/zh-CN.json";
import arSA from "./locales/ar-SA.json";

import { DEFAULT_LANGUAGE, Language } from "./languages";

const resources = {
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
};

const supportedLanguages = Object.keys(resources);

function resolveLanguage(browserLanguage: string): string {
  // 1. Exact locale
  if (supportedLanguages.includes(browserLanguage)) {
    return browserLanguage;
  }

  // 2. Base language
  const browserBase = browserLanguage.split("-")[0].toLowerCase();

  const matchedLanguage = supportedLanguages.find((language) => {
    return language.split("-")[0].toLowerCase() === browserBase;
  });

  if (matchedLanguage) {
    return matchedLanguage;
  }

  // 3. Fallback
  return DEFAULT_LANGUAGE;
}

const detectedLanguage = resolveLanguage(navigator.language);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: detectedLanguage,

    resources,

    supportedLngs: supportedLanguages,

    fallbackLng: DEFAULT_LANGUAGE,

    interpolation: {
      escapeValue: false,
    },
  });

const updateDocumentDirection = (language: string) => {
  const isRTL = language.startsWith("ar");

  document.documentElement.lang = language;
  document.documentElement.dir = isRTL ? "rtl" : "ltr";
};

updateDocumentDirection(i18n.language);

i18n.on("languageChanged", updateDocumentDirection);

export default i18n;
