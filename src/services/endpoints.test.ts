import { describe, expect, it } from "vitest";

import { API } from "./endpoints";

describe("API endpoints", () => {
  it("contains workflow GET_ALL endpoint", () => {
    expect(
      API.WORKFLOW.GET_ALL,
    ).toBe("/workflow");
  });

  it("contains workflow CREATE endpoint", () => {
    expect(
      API.WORKFLOW.CREATE,
    ).toBe("/workflow");
  });

  it("generates UPDATE endpoint", () => {
    expect(
      API.WORKFLOW.UPDATE(1),
    ).toBe("/workflow/1");
  });

  it("generates UPDATE endpoint for another id", () => {
    expect(
      API.WORKFLOW.UPDATE(123),
    ).toBe("/workflow/123");
  });

  it("generates DELETE endpoint", () => {
    expect(
      API.WORKFLOW.DELETE(1),
    ).toBe("/workflow/1");
  });

  it("generates DELETE endpoint for another id", () => {
    expect(
      API.WORKFLOW.DELETE(456),
    ).toBe("/workflow/456");
  });

  it("keeps GET_ALL and CREATE endpoints equal", () => {
    expect(
      API.WORKFLOW.GET_ALL,
    ).toBe(
      API.WORKFLOW.CREATE,
    );
  });
});