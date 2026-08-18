import { beforeEach, describe, expect, it, vi } from "vitest";

describe("i18n", () => {
  beforeEach(() => {
    vi.resetModules();

    document.documentElement.lang = "";
    document.documentElement.dir = "";

    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: "en-US",
    });
  });

  it("initializes with exact English locale", async () => {
    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: "en-US",
    });

    const { default: i18n } = await import("./index");

    expect(i18n.language).toBe("en-US");
    expect(document.documentElement.lang).toBe("en-US");
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("initializes with exact German locale", async () => {
    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: "de-DE",
    });

    const { default: i18n } = await import("./index");

    expect(i18n.language).toBe("de-DE");
    expect(document.documentElement.lang).toBe("de-DE");
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("initializes with exact Russian locale", async () => {
    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: "ru-RU",
    });

    const { default: i18n } = await import("./index");

    expect(i18n.language).toBe("ru-RU");
    expect(document.documentElement.lang).toBe("ru-RU");
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("initializes with exact Chinese locale", async () => {
    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: "zh-CN",
    });

    const { default: i18n } = await import("./index");

    expect(i18n.language).toBe("zh-CN");
    expect(document.documentElement.lang).toBe("zh-CN");
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("initializes with exact Arabic locale", async () => {
    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: "ar-SA",
    });

    const { default: i18n } = await import("./index");

    expect(i18n.language).toBe("ar-SA");
    expect(document.documentElement.lang).toBe("ar-SA");
    expect(document.documentElement.dir).toBe("rtl");
  });

  it("resolves German base language", async () => {
    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: "de-AT",
    });

    const { default: i18n } = await import("./index");

    expect(i18n.language).toBe("de-DE");
    expect(document.documentElement.lang).toBe("de-DE");
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("resolves Russian base language", async () => {
    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: "ru-UA",
    });

    const { default: i18n } = await import("./index");

    expect(i18n.language).toBe("ru-RU");
    expect(document.documentElement.lang).toBe("ru-RU");
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("resolves Chinese base language", async () => {
    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: "zh-TW",
    });

    const { default: i18n } = await import("./index");

    expect(i18n.language).toBe("zh-CN");
    expect(document.documentElement.lang).toBe("zh-CN");
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("resolves Arabic base language", async () => {
    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: "ar-EG",
    });

    const { default: i18n } = await import("./index");

    expect(i18n.language).toBe("ar-SA");
    expect(document.documentElement.lang).toBe("ar-SA");
    expect(document.documentElement.dir).toBe("rtl");
  });

  it("falls back to default language for unsupported locale", async () => {
    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: "fr-FR",
    });

    const { default: i18n } = await import("./index");

    expect(i18n.language).toBe("en-US");
    expect(document.documentElement.lang).toBe("en-US");
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("falls back to default language for Japanese locale", async () => {
    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: "ja-JP",
    });

    const { default: i18n } = await import("./index");

    expect(i18n.language).toBe("en-US");
    expect(document.documentElement.lang).toBe("en-US");
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("sets RTL direction when language changes to Arabic", async () => {
    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: "en-US",
    });

    const { default: i18n } = await import("./index");

    expect(document.documentElement.dir).toBe("ltr");

    await i18n.changeLanguage("ar-SA");

    expect(document.documentElement.lang).toBe("ar-SA");
    expect(document.documentElement.dir).toBe("rtl");
  });

  it("sets LTR direction when changing from Arabic to English", async () => {
    Object.defineProperty(navigator, "language", {
      configurable: true,
      value: "ar-SA",
    });

    const { default: i18n } = await import("./index");

    expect(document.documentElement.lang).toBe("ar-SA");
    expect(document.documentElement.dir).toBe("rtl");

    await i18n.changeLanguage("en-US");

    expect(document.documentElement.lang).toBe("en-US");
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("updates document direction when changing to German", async () => {
    const { default: i18n } = await import("./index");

    await i18n.changeLanguage("de-DE");

    expect(document.documentElement.lang).toBe("de-DE");
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("updates document direction when changing to Russian", async () => {
    const { default: i18n } = await import("./index");

    await i18n.changeLanguage("ru-RU");

    expect(document.documentElement.lang).toBe("ru-RU");
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("updates document direction when changing to Chinese", async () => {
    const { default: i18n } = await import("./index");

    await i18n.changeLanguage("zh-CN");

    expect(document.documentElement.lang).toBe("zh-CN");
    expect(document.documentElement.dir).toBe("ltr");
  });
});
