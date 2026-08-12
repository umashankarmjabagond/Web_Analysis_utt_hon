import { describe, expect, it } from "vitest";

import {
  DEFAULT_LANGUAGE,
  Language,
} from "./languages";

describe("Language", () => {
  it("contains EN_US language", () => {
    expect(Language.EN_US).toBe(
      "en-US",
    );
  });

  it("contains DE_DE language", () => {
    expect(Language.DE_DE).toBe(
      "de-DE",
    );
  });

  it("contains RU_RU language", () => {
    expect(Language.RU_RU).toBe(
      "ru-RU",
    );
  });

  it("contains ZH_CN language", () => {
    expect(Language.ZH_CN).toBe(
      "zh-CN",
    );
  });

  it("contains AR_SA language", () => {
    expect(Language.AR_SA).toBe(
      "ar-SA",
    );
  });

  it("contains all expected language values", () => {
    expect(Language).toEqual({
      EN_US: "en-US",
      DE_DE: "de-DE",
      RU_RU: "ru-RU",
      ZH_CN: "zh-CN",
      AR_SA: "ar-SA",
    });
  });

  it("sets EN_US as default language", () => {
    expect(DEFAULT_LANGUAGE).toBe(
      Language.EN_US,
    );
  });
});