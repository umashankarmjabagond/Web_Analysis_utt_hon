import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "../../test";

import DonutChart from "./DonutChart";

const mockPieProps = vi.fn();
const mockSectorProps = vi.fn();

vi.mock("recharts", () => ({
  PieChart: ({ children }: { children: ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),

  Pie: (props: Record<string, unknown>) => {
    mockPieProps(props);

    const renderedShape = props.shape
      ? (props.shape as (p: Record<string, unknown>) => ReactNode)({
          payload: { name: "Good", value: 10, fill: "#22c55e" },
        })
      : null;

    return <div data-testid="pie">{renderedShape}</div>;
  },

  Sector: (props: Record<string, unknown>) => {
    mockSectorProps(props);
    return <div data-testid="sector" />;
  },
}));

describe("DonutChart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const data = [
    { name: "Good", value: 10 },
    { name: "Warning", value: 4 },
    { name: "Error", value: 3 },
  ];

  const colors = {
    Good: "#22c55e",
    Warning: "#fbbf24",
    Error: "#ef4444",
  };

  it("renders pie chart", () => {
    render(<DonutChart data={data} colors={colors} />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("renders pie", () => {
    render(<DonutChart data={data} colors={colors} />);
    expect(screen.getByTestId("pie")).toBeInTheDocument();
  });

  it("renders sector via the custom shape renderer", () => {
    render(<DonutChart data={data} colors={colors} />);
    expect(screen.getByTestId("sector")).toBeInTheDocument();
  });

  it("uses default size for radii", () => {
    render(<DonutChart data={data} colors={colors} />);
    const pieProps = mockPieProps.mock.calls[0][0];

    
    expect(pieProps.innerRadius).toBe(34);
    expect(pieProps.outerRadius).toBe(44);
  });

  it("uses custom size for radii", () => {
    render(<DonutChart data={data} colors={colors} size={100} />);
    const pieProps = mockPieProps.mock.calls[0][0];
    expect(pieProps.innerRadius).toBe(40);
    expect(pieProps.outerRadius).toBe(50);
  });

  it("orders and enriches chart data with fill colors", () => {
    render(<DonutChart data={data} colors={colors} />);
    const pieProps = mockPieProps.mock.calls[0][0];

    expect(pieProps.data).toEqual([
      { name: "Good", value: 10, fill: "#22c55e" },
      { name: "Warning", value: 4, fill: "#fbbf24" },
      { name: "Error", value: 3, fill: "#ef4444" },
    ]);
  });

  it("filters out items that are not part of the known status order", () => {
    const mixedData = [
      { name: "Unknown", value: 99 },
      { name: "Good", value: 10 },
    ];

    render(<DonutChart data={mixedData} colors={colors} />);
    const pieProps = mockPieProps.mock.calls[0][0];

    expect(pieProps.data).toEqual([{ name: "Good", value: 10, fill: "#22c55e" }]);
  });

  it("reorders data to Good, Warning, Error regardless of input order", () => {
    const unorderedData = [
      { name: "Error", value: 3 },
      { name: "Good", value: 10 },
      { name: "Warning", value: 4 },
    ];

    render(<DonutChart data={unorderedData} colors={colors} />);
    const pieProps = mockPieProps.mock.calls[0][0];

    expect(
      pieProps.data.map((item: { name: string }) => item.name),
    ).toEqual(["Good", "Warning", "Error"]);
  });

  it("uses correct data key", () => {
    render(<DonutChart data={data} colors={colors} />);
    const pieProps = mockPieProps.mock.calls[0][0];
    expect(pieProps.dataKey).toBe("value");
  });

  it("sets padding angle and stroke", () => {
    render(<DonutChart data={data} colors={colors} />);
    const pieProps = mockPieProps.mock.calls[0][0];

    expect(pieProps.paddingAngle).toBe(2);
    expect(pieProps.stroke).toBe("none");
  });

  it("creates a custom shape renderer function", () => {
    render(<DonutChart data={data} colors={colors} />);
    const pieProps = mockPieProps.mock.calls[0][0];
    expect(typeof pieProps.shape).toBe("function");
  });

  it("passes the item's fill color to Sector via the shape renderer", () => {
    render(<DonutChart data={data} colors={colors} />);

    expect(mockSectorProps).toHaveBeenCalledWith(
      expect.objectContaining({ fill: "#22c55e" }),
    );
  });

  it("renders legend item names", () => {
    render(<DonutChart data={data} colors={colors} />);
    expect(screen.getByText("Good")).toBeInTheDocument();
    expect(screen.getByText("Warning")).toBeInTheDocument();
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("renders legend values", () => {
    render(<DonutChart data={data} colors={colors} />);
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("applies correct colors to legend indicators", () => {
    const { container } = render(<DonutChart data={data} colors={colors} />);
    const indicators = container.querySelectorAll('[style*="background-color"]');

    expect(indicators).toHaveLength(3);
    expect(indicators[0]).toHaveStyle({ backgroundColor: colors.Good });
    expect(indicators[1]).toHaveStyle({ backgroundColor: colors.Warning });
    expect(indicators[2]).toHaveStyle({ backgroundColor: colors.Error });
  });

  it("applies className to the outer wrapper", () => {
    const { container } = render(
      <DonutChart data={data} colors={colors} className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders nothing in the pie for empty data", () => {
    render(<DonutChart data={[]} colors={colors} />);
    const pieProps = mockPieProps.mock.calls[0][0];
    expect(pieProps.data).toEqual([]);
  });
});
