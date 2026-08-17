import { beforeEach, describe, expect, it, vi } from "vitest";

import workflowService from "./WorkflowService";
import { BaseService } from "../BaseService";

type MockResponse = unknown;

type BaseServiceTestMethods = {
  get: (url: string, ...args: unknown[]) => Promise<MockResponse>;

  post: (url: string, ...args: unknown[]) => Promise<MockResponse>;

  put: (url: string, ...args: unknown[]) => Promise<MockResponse>;

  delete: (url: string, ...args: unknown[]) => Promise<MockResponse>;
};

const getBaseServicePrototype = (): BaseServiceTestMethods =>
  BaseService.prototype as unknown as BaseServiceTestMethods;

describe("WorkflowService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAll calls get with workflow endpoint", async () => {
    const getSpy = vi
      .spyOn(getBaseServicePrototype(), "get")
      .mockResolvedValue([]);

    await workflowService.getAll();

    expect(getSpy).toHaveBeenCalledWith("/workflow");
  });

  it("returns result from getAll", async () => {
    const response = [
      {
        id: 1,
      },
    ];

    vi.spyOn(getBaseServicePrototype(), "get").mockResolvedValue(response);

    const result = await workflowService.getAll();

    expect(result).toEqual(response);
  });

  it("create calls post with correct arguments", async () => {
    const postSpy = vi
      .spyOn(getBaseServicePrototype(), "post")
      .mockResolvedValue({});

    const payload = {
      name: "workflow",
    };

    await workflowService.create(payload);

    expect(postSpy).toHaveBeenCalledWith(
      "/workflow",
      payload,
      "Workflow created successfully.",
    );
  });

  it("returns result from create", async () => {
    const response = {
      id: 1,
    };

    vi.spyOn(getBaseServicePrototype(), "post").mockResolvedValue(response);

    const result = await workflowService.create({});

    expect(result).toEqual(response);
  });

  it("update calls put with correct arguments", async () => {
    const putSpy = vi
      .spyOn(getBaseServicePrototype(), "put")
      .mockResolvedValue({});

    const payload = {
      name: "updated workflow",
    };

    await workflowService.update(123, payload);

    expect(putSpy).toHaveBeenCalledWith(
      "/workflow/123",
      payload,
      "Workflow updated successfully.",
    );
  });

  it("returns result from update", async () => {
    const response = {
      updated: true,
    };

    vi.spyOn(getBaseServicePrototype(), "put").mockResolvedValue(response);

    const result = await workflowService.update(123, {});

    expect(result).toEqual(response);
  });

  it("remove calls delete with correct arguments", async () => {
    const deleteSpy = vi
      .spyOn(getBaseServicePrototype(), "delete")
      .mockResolvedValue({});

    await workflowService.remove(456);

    expect(deleteSpy).toHaveBeenCalledWith(
      "/workflow/456",
      "Workflow deleted successfully.",
    );
  });

  it("returns result from remove", async () => {
    const response = {
      deleted: true,
    };

    vi.spyOn(getBaseServicePrototype(), "delete").mockResolvedValue(response);

    const result = await workflowService.remove(456);

    expect(result).toEqual(response);
  });
});
