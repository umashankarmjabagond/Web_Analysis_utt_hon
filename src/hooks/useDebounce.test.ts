import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  it("returns initial value immediately", () => {
    const { result } = renderHook(() =>
      useDebounce("initial"),
    );

    expect(result.current).toBe(
      "initial",
    );
  });

  it("updates value after default delay", () => {
    vi.useFakeTimers();

    const {
      result,
      rerender,
    } = renderHook(
      ({ value }) =>
        useDebounce(value),
      {
        initialProps: {
          value: "John",
        },
      },
    );

    rerender({
      value: "Jane",
    });

    expect(result.current).toBe(
      "John",
    );

    act(() => {
      vi.advanceTimersByTime(
        300,
      );
    });

    expect(result.current).toBe(
      "Jane",
    );

    vi.useRealTimers();
  });

  it("does not update before delay expires", () => {
    vi.useFakeTimers();

    const {
      result,
      rerender,
    } = renderHook(
      ({ value }) =>
        useDebounce(value),
      {
        initialProps: {
          value: "John",
        },
      },
    );

    rerender({
      value: "Jane",
    });

    act(() => {
      vi.advanceTimersByTime(
        299,
      );
    });

    expect(result.current).toBe(
      "John",
    );

    vi.useRealTimers();
  });

  it("updates value after custom delay", () => {
    vi.useFakeTimers();

    const {
      result,
      rerender,
    } = renderHook(
      ({ value }) =>
        useDebounce(
          value,
          500,
        ),
      {
        initialProps: {
          value: "John",
        },
      },
    );

    rerender({
      value: "Jane",
    });

    act(() => {
      vi.advanceTimersByTime(
        500,
      );
    });

    expect(result.current).toBe(
      "Jane",
    );

    vi.useRealTimers();
  });

  it("clears previous timer when value changes rapidly", () => {
    vi.useFakeTimers();

    const {
      result,
      rerender,
    } = renderHook(
      ({ value }) =>
        useDebounce(
          value,
          300,
        ),
      {
        initialProps: {
          value: "John",
        },
      },
    );

    rerender({
      value: "Jane",
    });

    act(() => {
      vi.advanceTimersByTime(
        100,
      );
    });

    rerender({
      value: "Mike",
    });

    act(() => {
      vi.advanceTimersByTime(
        300,
      );
    });

    expect(result.current).toBe(
      "Mike",
    );

    vi.useRealTimers();
  });

  it("handles numeric values", () => {
    vi.useFakeTimers();

    const {
      result,
      rerender,
    } = renderHook(
      ({ value }) =>
        useDebounce(
          value,
          300,
        ),
      {
        initialProps: {
          value: 1,
        },
      },
    );

    rerender({
      value: 2,
    });

    act(() => {
      vi.advanceTimersByTime(
        300,
      );
    });

    expect(result.current).toBe(
      2,
    );

    vi.useRealTimers();
  });
});