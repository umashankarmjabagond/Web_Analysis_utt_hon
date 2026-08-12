import { render, screen } from "@testing-library/react";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import StatCard from "./StatCard";
import { STATUS_COLORS } from "../../../constants/constants";

const mockDonutChart = vi.fn();

vi.mock(
  "../../../components/charts/DonutChart",
  () => ({
    default: (props: {
      data: unknown[];
      size: number;
      colors: unknown;
    }) => {
      mockDonutChart(props);

      return (
        <div data-testid="donut-chart">
          DonutChart
        </div>
      );
    },
  }),
);

describe("StatCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockData = {
    title: "TOTAL UNITS",
    chartData: [
      {
        name: "Good",
        value: 10,
      },
      {
        name: "Warning",
        value: 4,
      },
      {
        name: "Error",
        value: 3,
      },
    ],
  };

  it("renders title", () => {
    render(
      <StatCard data={mockData} />,
    );

    expect(
      screen.getByText(
        "TOTAL UNITS",
      ),
    ).toBeInTheDocument();
  });

  it("renders donut chart", () => {
    render(
      <StatCard data={mockData} />,
    );

    expect(
      screen.getByTestId(
        "donut-chart",
      ),
    ).toBeInTheDocument();
  });

  it("calculates and renders total value", () => {
    render(
      <StatCard data={mockData} />,
    );

    expect(
      screen.getByText("17"),
    ).toBeInTheDocument();
  });

  it("renders legend item names", () => {
    render(
      <StatCard data={mockData} />,
    );

    expect(
      screen.getByText("Good"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Warning",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Error"),
    ).toBeInTheDocument();
  });

  it("renders legend values", () => {
    render(
      <StatCard data={mockData} />,
    );

    expect(
      screen.getByText("10"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("4"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("3"),
    ).toBeInTheDocument();
  });

  it("passes correct props to DonutChart", () => {
    render(
      <StatCard data={mockData} />,
    );

    expect(
      mockDonutChart,
    ).toHaveBeenCalledWith({
      data: mockData.chartData,
      size: 88,
      colors:
        STATUS_COLORS,
    });
  });

  it("renders correct number of legend items", () => {
    const { container } =
      render(
        <StatCard
          data={mockData}
        />,
      );

    expect(
      container.querySelectorAll(
        '[style*="background-color"]',
      ),
    ).toHaveLength(3);
  });

  it("applies correct status colors", () => {
    const { container } =
      render(
        <StatCard
          data={mockData}
        />,
      );

    const indicators =
      container.querySelectorAll(
        '[style*="background-color"]',
      );

    expect(
      indicators[0],
    ).toHaveStyle({
      backgroundColor:
        STATUS_COLORS.Good,
    });

    expect(
      indicators[1],
    ).toHaveStyle({
      backgroundColor:
        STATUS_COLORS.Warning,
    });

    expect(
      indicators[2],
    ).toHaveStyle({
      backgroundColor:
        STATUS_COLORS.Error,
    });
  });

  it("renders total as zero when chartData is empty", () => {
    render(
      <StatCard
        data={{
          title:
            "EMPTY CARD",
          chartData: [],
        }}
      />,
    );

    expect(
      screen.getByText("0"),
    ).toBeInTheDocument();
  });

  it("passes empty data to DonutChart", () => {
    render(
      <StatCard
        data={{
          title:
            "EMPTY CARD",
          chartData: [],
        }}
      />,
    );

    expect(
      mockDonutChart,
    ).toHaveBeenCalledWith({
      data: [],
      size: 88,
      colors:
        STATUS_COLORS,
    });
  });
});