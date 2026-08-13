import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../test";

import DonutChart from "./DonutChart";

const mockPieProps = vi.fn();
const mockSectorProps = vi.fn();

vi.mock("recharts", () => ({
  ResponsiveContainer: ({
    children,
  }: {
    children: React.ReactNode;
  }) => (
    <div data-testid="responsive-container">
      {children}
    </div>
  ),

  PieChart: ({
    children,
  }: {
    children: React.ReactNode;
  }) => (
    <div data-testid="pie-chart">
      {children}
    </div>
  ),

  Pie: (props: Record<string, unknown>) => {
    mockPieProps(props);

    let renderedShape = null;

if (props.shape) {
  renderedShape = (
    props.shape as (
      props: Record<string, unknown>,
    ) => React.ReactNode
  )({
    payload: {
      name: "Success",
    },
  });
}

return (
  <div data-testid="pie">
    Pie
    {renderedShape}
  </div>
);

    return (
      <div data-testid="pie">
        Pie
      </div>
    );
  },

  Sector: (
    props: Record<string, unknown>,
  ) => {
    mockSectorProps(props);

    return (
      <div data-testid="sector">
        Sector
      </div>
    );
  },
}));

describe("DonutChart", () => {
  const data = [
    {
      name: "Success",
      value: 70,
    },
    {
      name: "Failed",
      value: 30,
    },
  ];

  const colors = {
    Success: "#00ff00",
    Failed: "#ff0000",
  };

  it("renders responsive container", () => {
    render(
      <DonutChart
        data={data}
        colors={colors}
      />,
    );

    expect(
      screen.getByTestId(
        "responsive-container",
      ),
    ).toBeInTheDocument();
  });

  it("renders pie chart", () => {
    render(
      <DonutChart
        data={data}
        colors={colors}
      />,
    );

    expect(
      screen.getByTestId("pie-chart"),
    ).toBeInTheDocument();
  });

  it("renders pie", () => {
    render(
      <DonutChart
        data={data}
        colors={colors}
      />,
    );

    expect(
      screen.getByTestId("pie"),
    ).toBeInTheDocument();
  });

  it("uses default size", () => {
    render(
      <DonutChart
        data={data}
        colors={colors}
      />,
    );

    const pieProps =
      mockPieProps.mock.calls[0][0];

    expect(
      pieProps.innerRadius,
    ).toBe(25.6);

    expect(
      pieProps.outerRadius,
    ).toBe(38.4);
  });

  it("uses custom size", () => {
    render(
      <DonutChart
        data={data}
        colors={colors}
        size={100}
      />,
    );

    const pieProps =
      mockPieProps.mock.calls.at(-1)?.[0];

    expect(
      pieProps.innerRadius,
    ).toBe(32);

    expect(
      pieProps.outerRadius,
    ).toBe(48);
  });

  it("passes chart data", () => {
    render(
      <DonutChart
        data={data}
        colors={colors}
      />,
    );

    const pieProps =
      mockPieProps.mock.calls[0][0];

    expect(
      pieProps.data,
    ).toEqual(data);
  });

  it("uses correct data key", () => {
    render(
      <DonutChart
        data={data}
        colors={colors}
      />,
    );

    const pieProps =
      mockPieProps.mock.calls[0][0];

    expect(
      pieProps.dataKey,
    ).toBe("value");
  });

  it("uses correct name key", () => {
    render(
      <DonutChart
        data={data}
        colors={colors}
      />,
    );

    const pieProps =
      mockPieProps.mock.calls[0][0];

    expect(
      pieProps.nameKey,
    ).toBe("name");
  });

  it("disables animation", () => {
    render(
      <DonutChart
        data={data}
        colors={colors}
      />,
    );

    const pieProps =
      mockPieProps.mock.calls[0][0];

    expect(
      pieProps.isAnimationActive,
    ).toBe(false);
  });

  it("creates custom shape renderer", () => {
  render(
    <DonutChart
      data={data}
      colors={colors}
    />,
  );

  const pieProps =
    mockPieProps.mock.calls[0][0];

  expect(
    typeof pieProps.shape,
  ).toBe("function");
});

  it("sets pie positioning values", () => {
    render(
      <DonutChart
        data={data}
        colors={colors}
      />,
    );

    const pieProps =
      mockPieProps.mock.calls[0][0];

    expect(
      pieProps.cx,
    ).toBe("50%");

    expect(
      pieProps.cy,
    ).toBe("50%");
  });

  it("sets padding angle and stroke", () => {
    render(
      <DonutChart
        data={data}
        colors={colors}
      />,
    );

    const pieProps =
      mockPieProps.mock.calls[0][0];

    expect(
      pieProps.paddingAngle,
    ).toBe(0);

    expect(
      pieProps.stroke,
    ).toBe("none");
  });
});