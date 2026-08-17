import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const mockRequestUse = vi.fn();
const mockResponseUse = vi.fn();

const mockApiInstance = {
  interceptors: {
    request: {
      use: mockRequestUse,
    },
    response: {
      use: mockResponseUse,
    },
  },
};

const mockCreate = vi.fn(
  () => mockApiInstance,
);

vi.mock("axios", () => ({
  default: {
    create: mockCreate,
  },
}));

describe("api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("creates axios instance with expected config", async () => {
    await import("./api");

    expect(
      mockCreate,
    ).toHaveBeenCalledWith({
      baseURL:
        import.meta.env
          .VITE_API_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type":
          "application/json",
      },
    });
  });

  it("registers request interceptor", async () => {
    await import("./api");

    expect(
      mockRequestUse,
    ).toHaveBeenCalledTimes(1);
  });

  it("registers response interceptor", async () => {
    await import("./api");

    expect(
      mockResponseUse,
    ).toHaveBeenCalledTimes(1);
  });

  it("adds authorization header when token exists", async () => {
    Storage.prototype.getItem =
      vi.fn(() => "mock-token");

    await import("./api");

    const requestHandler =
      mockRequestUse.mock.calls[0][0];

    const config = {
      headers: {},
    };

    const result =
      requestHandler(config);

    expect(
      result.headers.Authorization,
    ).toBe(
      "Bearer mock-token",
    );
  });

  it("does not add authorization header when token does not exist", async () => {
    Storage.prototype.getItem =
      vi.fn(() => null);

    await import("./api");

    const requestHandler =
      mockRequestUse.mock.calls[0][0];

    const config = {
      headers: {},
    };

    const result =
      requestHandler(config);

    expect(
      result.headers.Authorization,
    ).toBeUndefined();
  });

  it("request interceptor error handler rejects error", async () => {
    await import("./api");

    const errorHandler =
      mockRequestUse.mock.calls[0][1];

    const error =
      new Error("request error");

    await expect(
      errorHandler(error),
    ).rejects.toThrow(
      "request error",
    );
  });

  it("response success interceptor returns response", async () => {
    await import("./api");

    const successHandler =
      mockResponseUse.mock.calls[0][0];

    const response = {
      data: {
        id: 1,
      },
    };

    expect(
      successHandler(response),
    ).toBe(response);
  });

  it("handles 401 response", async () => {
    const consoleSpy = vi
      .spyOn(console, "log")
      .mockImplementation(() => {});

    await import("./api");

    const errorHandler =
      mockResponseUse.mock.calls[0][1];

    const error = {
      response: {
        status: 401,
      },
    };

    await expect(
      errorHandler(error),
    ).rejects.toEqual(error);

    expect(
      consoleSpy,
    ).toHaveBeenCalledWith(
      "Unauthorized",
    );

    consoleSpy.mockRestore();
  });

  it("handles 403 response", async () => {
    const consoleSpy = vi
      .spyOn(console, "log")
      .mockImplementation(() => {});

    await import("./api");

    const errorHandler =
      mockResponseUse.mock.calls[0][1];

    const error = {
      response: {
        status: 403,
      },
    };

    await expect(
      errorHandler(error),
    ).rejects.toEqual(error);

    expect(
      consoleSpy,
    ).toHaveBeenCalledWith(
      "Forbidden",
    );

    consoleSpy.mockRestore();
  });

  it("handles 500 response", async () => {
    const consoleSpy = vi
      .spyOn(console, "log")
      .mockImplementation(() => {});

    await import("./api");

    const errorHandler =
      mockResponseUse.mock.calls[0][1];

    const error = {
      response: {
        status: 500,
      },
    };

    await expect(
      errorHandler(error),
    ).rejects.toEqual(error);

    expect(
      consoleSpy,
    ).toHaveBeenCalledWith(
      "Server Error",
    );

    consoleSpy.mockRestore();
  });

  it("handles unknown response status", async () => {
    const consoleSpy = vi
      .spyOn(console, "log")
      .mockImplementation(() => {});

    await import("./api");

    const errorHandler =
      mockResponseUse.mock.calls[0][1];

    const error = {
      response: {
        status: 404,
      },
    };

    await expect(
      errorHandler(error),
    ).rejects.toEqual(error);

    expect(
      consoleSpy,
    ).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("handles missing response object", async () => {
    const consoleSpy = vi
      .spyOn(console, "log")
      .mockImplementation(() => {});

    await import("./api");

    const errorHandler =
      mockResponseUse.mock.calls[0][1];

    const error = {};

    await expect(
      errorHandler(error),
    ).rejects.toEqual(error);

    expect(
      consoleSpy,
    ).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});