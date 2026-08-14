import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const initMock = vi.fn();
const onMock = vi.fn();

const i18nMock = {
  language: "en-US",
  use: vi.fn(),
  init: initMock,
  on: onMock,
};

i18nMock.use.mockReturnValue(i18nMock);

vi.mock("i18next", () => ({
  __esModule: true,
  default: i18nMock,
}));

vi.mock(
  "i18next-browser-languagedetector",
  () => ({
    __esModule: true,
    default: {},
  }),
);

vi.mock("react-i18next", () => ({
  initReactI18next: {},
}));

vi.mock("./locales/en-US.json", () => ({
  default: {
    hello: "Hello",
  },
}));

vi.mock("./locales/de-DE.json", () => ({
  default: {
    hello: "Hallo",
  },
}));

vi.mock("./locales/ru-RU.json", () => ({
  default: {
    hello: "Привет",
  },
}));

vi.mock("./locales/zh-CN.json", () => ({
  default: {
    hello: "你好",
  },
}));

vi.mock("./locales/ar-SA.json", () => ({
  default: {
    hello: "مرحبا",
  },
}));

vi.mock("./languages", () => ({
  DEFAULT_LANGUAGE: "en-US",

  Language: {
    EN_US: "en-US",
    DE_DE: "de-DE",
    RU_RU: "ru-RU",
    ZH_CN: "zh-CN",
    AR_SA: "ar-SA",
  },
}));

describe("i18n index", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    i18nMock.language = "en-US";
    i18nMock.use.mockReturnValue(i18nMock);

    document.documentElement.lang = "";
    document.documentElement.dir = "";

    Object.defineProperty(
      window.navigator,
      "language",
      {
        configurable: true,
        value: "en-US",
      },
    );
  });

  it("debug i18next mock", async () => {
    const i18next = await import("i18next");

    expect(i18next.default).toBeDefined();
    expect(i18next.default.use).toBeDefined();
  });

  it("initializes i18n", async () => {
    await import("./index");

    expect(i18nMock.use).toHaveBeenCalledTimes(2);
    expect(initMock).toHaveBeenCalledTimes(1);
  });

  it("calls use with LanguageDetector", async () => {
    await import("./index");

    expect(i18nMock.use).toHaveBeenCalledTimes(2);
  });

  it("uses exact language match", async () => {
    Object.defineProperty(
      window.navigator,
      "language",
      {
        configurable: true,
        value: "de-DE",
      },
    );

    await import("./index");

    expect(initMock).toHaveBeenCalledWith(
      expect.objectContaining({
        lng: "de-DE",
      }),
    );
  });

  it("uses base language match", async () => {
    Object.defineProperty(
      window.navigator,
      "language",
      {
        configurable: true,
        value: "en-IN",
      },
    );

    await import("./index");

    expect(initMock).toHaveBeenCalledWith(
      expect.objectContaining({
        lng: "en-US",
      }),
    );
  });

  it("uses fallback language", async () => {
    Object.defineProperty(
      window.navigator,
      "language",
      {
        configurable: true,
        value: "fr-FR",
      },
    );

    await import("./index");

    expect(initMock).toHaveBeenCalledWith(
      expect.objectContaining({
        lng: "en-US",
      }),
    );
  });

  it("passes correct configuration", async () => {
    await import("./index");

    expect(initMock).toHaveBeenCalledWith(
      expect.objectContaining({
        lng: "en-US",
        fallbackLng: "en-US",
        supportedLngs: [
          "en-US",
          "de-DE",
          "ru-RU",
          "zh-CN",
          "ar-SA",
        ],
        interpolation: {
          escapeValue: false,
        },
      }),
    );
  });

  it("registers all resources", async () => {
    await import("./index");

    const config = initMock.mock.calls[0][0];

    expect(config.resources).toEqual({
      "en-US": {
        translation: {
          hello: "Hello",
        },
      },
      "de-DE": {
        translation: {
          hello: "Hallo",
        },
      },
      "ru-RU": {
        translation: {
          hello: "Привет",
        },
      },
      "zh-CN": {
        translation: {
          hello: "你好",
        },
      },
      "ar-SA": {
        translation: {
          hello: "مرحبا",
        },
      },
    });
  });

  it("sets ltr direction", async () => {
    i18nMock.language = "en-US";

    await import("./index");

    expect(
      document.documentElement.lang,
    ).toBe("en-US");

    expect(
      document.documentElement.dir,
    ).toBe("ltr");
  });

  it("sets rtl direction", async () => {
    i18nMock.language = "ar-SA";

    await import("./index");

    expect(
      document.documentElement.lang,
    ).toBe("ar-SA");

    expect(
      document.documentElement.dir,
    ).toBe("rtl");
  });

  it("registers languageChanged event", async () => {
    await import("./index");

    expect(onMock).toHaveBeenCalledWith(
      "languageChanged",
      expect.any(Function),
    );
  });

  it("updates direction when language changes", async () => {
    await import("./index");

    const handler =
      onMock.mock.calls[0][1];

    handler("ar-SA");

    expect(
      document.documentElement.lang,
    ).toBe("ar-SA");

    expect(
      document.documentElement.dir,
    ).toBe("rtl");

    handler("en-US");

    expect(
      document.documentElement.lang,
    ).toBe("en-US");

    expect(
      document.documentElement.dir,
    ).toBe("ltr");
  });

  it("exports i18n instance", async () => {
    const module =
      await import("./index");

    expect(module.default).toBe(
      i18nMock,
    );
  });
});