import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import workflowService from "./WorkflowService";
import { BaseService } from "../BaseService";

describe("WorkflowService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAll calls get with workflow endpoint", async () => {
    const getSpy = vi
      .spyOn(
        BaseService.prototype as any,
        "get",
      )
      .mockResolvedValue([]);

    await workflowService.getAll();

    expect(getSpy).toHaveBeenCalledWith(
      "/workflow",
    );
  });

  it("returns result from getAll", async () => {
    const response = [
      { id: 1 },
    ];

    vi.spyOn(
      BaseService.prototype as any,
      "get",
    ).mockResolvedValue(response);

    const result =
      await workflowService.getAll();

    expect(result).toEqual(response);
  });

  it("create calls post with correct arguments", async () => {
    const postSpy = vi
      .spyOn(
        BaseService.prototype as any,
        "post",
      )
      .mockResolvedValue({});

    const payload = {
      name: "workflow",
    };

    await workflowService.create(
      payload,
    );

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

    vi.spyOn(
      BaseService.prototype as any,
      "post",
    ).mockResolvedValue(response);

    const result =
      await workflowService.create(
        {},
      );

    expect(result).toEqual(response);
  });

  it("update calls put with correct arguments", async () => {
    const putSpy = vi
      .spyOn(
        BaseService.prototype as any,
        "put",
      )
      .mockResolvedValue({});

    const payload = {
      name: "updated workflow",
    };

    await workflowService.update(
      123,
      payload,
    );

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

    vi.spyOn(
      BaseService.prototype as any,
      "put",
    ).mockResolvedValue(response);

    const result =
      await workflowService.update(
        123,
        {},
      );

    expect(result).toEqual(response);
  });

  it("remove calls delete with correct arguments", async () => {
    const deleteSpy = vi
      .spyOn(
        BaseService.prototype as any,
        "delete",
      )
      .mockResolvedValue({});

    await workflowService.remove(
      456,
    );

    expect(deleteSpy).toHaveBeenCalledWith(
      "/workflow/456",
      "Workflow deleted successfully.",
    );
  });

  it("returns result from remove", async () => {
    const response = {
      deleted: true,
    };

    vi.spyOn(
      BaseService.prototype as any,
      "delete",
    ).mockResolvedValue(response);

    const result =
      await workflowService.remove(
        456,
      );

    expect(result).toEqual(response);
  });
});