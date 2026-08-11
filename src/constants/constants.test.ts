import { describe, expect, it } from "vitest";

import { STATUS_COLORS } from "./constants";

describe("STATUS_COLORS", () => {
  it("exports STATUS_COLORS object", () => {
    expect(STATUS_COLORS).toBeDefined();
  });

  it("contains Good status color", () => {
    expect(STATUS_COLORS.Good).toBe(
      "#68D560",
    );
  });

  it("contains Warning status color", () => {
    expect(
      STATUS_COLORS.Warning,
    ).toBe("#FFDB42");
  });

  it("contains Error status color", () => {
    expect(STATUS_COLORS.Error).toBe(
      "#FF644C",
    );
  });

  it("contains all expected keys", () => {
    expect(
      Object.keys(STATUS_COLORS),
    ).toEqual([
      "Good",
      "Warning",
      "Error",
    ]);
  });

  it("matches the expected object", () => {
    expect(STATUS_COLORS).toEqual({
      Good: "#68D560",
      Warning: "#FFDB42",
      Error: "#FF644C",
    });
  });
});