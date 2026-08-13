import { describe, expect, it } from "vitest";

import { STATUS_COLORS } from "./constants";

describe("STATUS_COLORS", () => {
  it("exports STATUS_COLORS object", () => {
    expect(STATUS_COLORS).toBeDefined();
  });

  it("contains Good status color", () => {
    expect(STATUS_COLORS.Good).toBe("var(--chart-success)");
  });

  it("contains Warning status color", () => {
    expect(STATUS_COLORS.Warning).toBe("var(--chart-warning)");
  });

  it("contains Error status color", () => {
    expect(STATUS_COLORS.Error).toBe("var(--chart-danger)");
  });

  it("contains all expected keys", () => {
    expect(Object.keys(STATUS_COLORS)).toEqual(["Good", "Warning", "Error"]);
  });

  it("matches the expected object", () => {
    expect(STATUS_COLORS).toEqual({
      Good: "var(--chart-success)",
      Warning: "var(--chart-warning)",
      Error: "var(--chart-danger)",
    });
  });
});
