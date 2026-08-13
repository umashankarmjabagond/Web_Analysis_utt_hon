export const Language = {
  EN_US: "en-US",
  DE_DE: "de-DE",
  RU_RU: "ru-RU",
  ZH_CN: "zh-CN",
  AR_SA: "ar-SA",
} as const;

export type Language = (typeof Language)[keyof typeof Language];

export const DEFAULT_LANGUAGE = Language.EN_US;