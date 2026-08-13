import { describe, expect, it, vi, beforeEach } from "vitest";
import type { AxiosRequestConfig } from "axios";

import api from "./api";
import { BaseService } from "./BaseService";

vi.mock("./api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

class TestService extends BaseService {
  public getData<T>(
    url: string,
    config?: AxiosRequestConfig,
  ) {
    return this.get<T>(url, config);
  }

  public postData<T>(
    url: string,
    payload?: unknown,
    successMessage?: string,
    config?: AxiosRequestConfig,
  ) {
    return this.post<T>(
      url,
      payload,
      successMessage,
      config,
    );
  }

  public putData<T>(
    url: string,
    payload?: unknown,
    successMessage?: string,
  ) {
    return this.put<T>(
      url,
      payload,
      successMessage,
    );
  }

  public deleteData<T>(
    url: string,
    successMessage?: string,
  ) {
    return this.delete<T>(
      url,
      successMessage,
    );
  }
}

describe("BaseService", () => {
  const service = new TestService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("get returns response data", async () => {
    const response = {
      data: { id: 1 },
    };

    vi.mocked(api.get).mockResolvedValue(
      response,
    );

    await expect(
      service.getData("/test"),
    ).resolves.toEqual({
      id: 1,
    });
  });

  it("get passes config", async () => {
    const config = {
      headers: {
        Authorization: "token",
      },
    };

    vi.mocked(api.get).mockResolvedValue({
      data: {},
    });

    await service.getData(
      "/test",
      config,
    );

    expect(api.get).toHaveBeenCalledWith(
      "/test",
      config,
    );
  });

  it("get handles error", async () => {
    const error =
      new Error("get error");

    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    vi.mocked(api.get).mockRejectedValue(
      error,
    );

    await expect(
      service.getData("/test"),
    ).rejects.toThrow("get error");

    expect(
      consoleSpy,
    ).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("post returns response data", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: { id: 1 },
    });

    await expect(
      service.postData("/test", {
        name: "test",
      }),
    ).resolves.toEqual({
      id: 1,
    });
  });

  it("post passes config", async () => {
    const config = {
      headers: {
        Authorization: "token",
      },
    };

    vi.mocked(api.post).mockResolvedValue({
      data: {},
    });

    await service.postData(
      "/test",
      {},
      undefined,
      config,
    );

    expect(api.post).toHaveBeenCalledWith(
      "/test",
      {},
      config,
    );
  });

  it("post executes successMessage branch", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: {},
    });

    await service.postData(
      "/test",
      {},
      "Saved",
    );

    expect(api.post).toHaveBeenCalled();
  });

  it("post handles error", async () => {
    const error =
      new Error("post error");

    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    vi.mocked(api.post).mockRejectedValue(
      error,
    );

    await expect(
      service.postData("/test"),
    ).rejects.toThrow("post error");

    expect(
      consoleSpy,
    ).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("put returns response data", async () => {
    vi.mocked(api.put).mockResolvedValue({
      data: { updated: true },
    });

    await expect(
      service.putData("/test"),
    ).resolves.toEqual({
      updated: true,
    });
  });

  it("put executes successMessage branch", async () => {
    vi.mocked(api.put).mockResolvedValue({
      data: {},
    });

    await service.putData(
      "/test",
      {},
      "Updated",
    );

    expect(api.put).toHaveBeenCalled();
  });

  it("put handles error", async () => {
    const error =
      new Error("put error");

    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    vi.mocked(api.put).mockRejectedValue(
      error,
    );

    await expect(
      service.putData("/test"),
    ).rejects.toThrow("put error");

    expect(
      consoleSpy,
    ).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("delete returns response data", async () => {
    vi.mocked(api.delete).mockResolvedValue({
      data: { deleted: true },
    });

    await expect(
      service.deleteData("/test"),
    ).resolves.toEqual({
      deleted: true,
    });
  });

  it("delete executes successMessage branch", async () => {
    vi.mocked(api.delete).mockResolvedValue({
      data: {},
    });

    await service.deleteData(
      "/test",
      "Deleted",
    );

    expect(api.delete).toHaveBeenCalled();
  });

  it("delete handles error", async () => {
    const error =
      new Error("delete error");

    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    vi.mocked(api.delete).mockRejectedValue(
      error,
    );

    await expect(
      service.deleteData("/test"),
    ).rejects.toThrow(
      "delete error",
    );

    expect(
      consoleSpy,
    ).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});