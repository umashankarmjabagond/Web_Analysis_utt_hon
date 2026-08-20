import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import StatCard from "./StatCard";
import { STATUS_COLORS } from "../../../constants/constants";

const mockDonutChart = vi.fn();

vi.mock("../../../components/charts/DonutChart", () => ({
  default: (props: { data: unknown[]; size: number; colors: unknown }) => {
    mockDonutChart(props);
    return <div data-testid="donut-chart">DonutChart</div>;
  },
}));

describe("StatCard", () => {
  let originalResizeObserver: typeof ResizeObserver | undefined;
  let observeSpy: ReturnType<typeof vi.fn>;
  let disconnectSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    originalResizeObserver = globalThis.ResizeObserver;

    observeSpy = vi.fn();
    disconnectSpy = vi.fn();

    class ResizeObserverMock {
      observe = observeSpy;
      unobserve = vi.fn();
      disconnect = disconnectSpy;
    }

    globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
  });

  afterEach(() => {
    globalThis.ResizeObserver = originalResizeObserver as typeof ResizeObserver;
    vi.restoreAllMocks();
  });

  const mockData = {
    title: "DASHBOARD_TOTAL_UNITS",
    chartData: [
      { name: "Good", value: 10 },
      { name: "Warning", value: 4 },
      { name: "Error", value: 3 },
    ],
  };

  it("renders formatted title", () => {
    render(<StatCard data={mockData} />);
    expect(screen.getByText("Total Units")).toBeInTheDocument();
  });

  it("sets the full formatted title as a tooltip", () => {
    render(<StatCard data={mockData} />);
    expect(screen.getByTitle("Total Units")).toBeInTheDocument();
  });

  it("renders the donut chart", () => {
    render(<StatCard data={mockData} />);
    expect(screen.getByTestId("donut-chart")).toBeInTheDocument();
  });

  it("calculates and renders the total value", () => {
    render(<StatCard data={mockData} />);
    expect(screen.getByText("17")).toBeInTheDocument();
  });

  it("passes correct props to DonutChart", () => {
    render(<StatCard data={mockData} />);
    expect(mockDonutChart).toHaveBeenCalledWith({
      data: mockData.chartData,
      size: 88,
      colors: STATUS_COLORS,
    });
  });

  it("renders total as zero when chartData is empty", () => {
    render(<StatCard data={{ title: "EMPTY_CARD", chartData: [] }} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("passes empty data to DonutChart", () => {
    render(<StatCard data={{ title: "EMPTY_CARD", chartData: [] }} />);
    expect(mockDonutChart).toHaveBeenCalledWith({
      data: [],
      size: 88,
      colors: STATUS_COLORS,
    });
  });

  it("formats a title with no underscore as a single capitalized word", () => {
    render(<StatCard data={{ title: "units", chartData: [] }} />);
    expect(screen.getByText("Units")).toBeInTheDocument();
  });

  it("sets up the ResizeObserver and observes the scroll container on mount", () => {
    render(<StatCard data={mockData} />);
    expect(observeSpy).toHaveBeenCalledTimes(1);
  });

  it("does NOT reset scrollLeft when content overflows (scrollWidth > clientWidth)", () => {
    const scrollWidthSpy = vi
      .spyOn(HTMLElement.prototype, "scrollWidth", "get")
      .mockReturnValue(200);
    const clientWidthSpy = vi
      .spyOn(HTMLElement.prototype, "clientWidth", "get")
      .mockReturnValue(100);
    const scrollLeftSetter = vi.fn();
    vi.spyOn(HTMLElement.prototype, "scrollLeft", "set").mockImplementation(
      scrollLeftSetter
    );

    render(<StatCard data={mockData} />);

    expect(scrollLeftSetter).not.toHaveBeenCalled();

    scrollWidthSpy.mockRestore();
    clientWidthSpy.mockRestore();
  });

  it("resets scrollLeft when content fits (scrollWidth <= clientWidth)", () => {
    const scrollWidthSpy = vi
      .spyOn(HTMLElement.prototype, "scrollWidth", "get")
      .mockReturnValue(80);
    const clientWidthSpy = vi
      .spyOn(HTMLElement.prototype, "clientWidth", "get")
      .mockReturnValue(100);
    const scrollLeftSetter = vi.fn();
    vi.spyOn(HTMLElement.prototype, "scrollLeft", "set").mockImplementation(
      scrollLeftSetter
    );

    render(<StatCard data={mockData} />);

    expect(scrollLeftSetter).toHaveBeenCalledWith(0);

    scrollWidthSpy.mockRestore();
    clientWidthSpy.mockRestore();
  });

  it("disconnects the observer when the component unmounts", () => {
    const { unmount } = render(<StatCard data={mockData} />);

    expect(observeSpy).toHaveBeenCalledTimes(1);

    unmount();
    
    expect(disconnectSpy).toHaveBeenCalledTimes(1);
  });
});