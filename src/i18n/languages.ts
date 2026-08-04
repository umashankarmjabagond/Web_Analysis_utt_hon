export const Language = {
  EN: "en",
  DE: "de",
  RU: "ru",
  ZH: "zh",
} as const;

export type Language = (typeof Language)[keyof typeof Language];

export const DEFAULT_LANGUAGE = Language.EN;