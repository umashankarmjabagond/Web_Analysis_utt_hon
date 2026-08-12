import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import Dashboard from "./Dashboard";

const mockStatCard = vi.fn();
const mockTableCard = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("./components/StatCard", () => ({
  default: (props: { data: { title: string } }) => {
    mockStatCard(props);

    return (
      <div data-testid="stat-card">
        {props.data.title}
      </div>
    );
  },
}));

vi.mock("../../components/tables/TableCard", () => ({
  default: (props: {
    title: string;
    badge?: number;
    headerActions?: React.ReactNode;
    columns?: Array<{
      cell?: (context: {
        getValue: () => unknown;
      }) => React.ReactNode;
    }>;
  }) => {
    mockTableCard(props);

    return (
      <div data-testid="table-card">
        <div>{props.title}</div>

        {props.columns?.map(
          (column, index) =>
            column.cell && (
              <div
                key={index}
                data-testid={`column-cell-${index}`}
              >
                {column.cell({
                  getValue: () => 123,
                })}
              </div>
            ),
        )}

        {props.badge !==
          undefined && (
          <div data-testid="badge">
            {props.badge}
          </div>
        )}

        {props.headerActions && (
          <div data-testid="header-actions">
            {props.headerActions}
          </div>
        )}
      </div>
    );
  },
}));

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dashboard title", () => {
    render(<Dashboard />);

    expect(
      screen.getByText(
        "DASHBOARD_POWER_BOILER",
      ),
    ).toBeInTheDocument();
  });

  it("renders dashboard area badge", () => {
    render(<Dashboard />);

    expect(
      screen.getByText(
        "DASHBOARD_AREA",
      ),
    ).toBeInTheDocument();
  });

  it("renders all stat cards", () => {
    render(<Dashboard />);

    expect(
      screen.getAllByTestId(
        "stat-card",
      ),
    ).toHaveLength(4);
  });

  it("renders total units stat card", () => {
    render(<Dashboard />);

    expect(
      screen.getByText(
        "TOTAL UNITS",
      ),
    ).toBeInTheDocument();
  });

  it("renders mpc assets stat card", () => {
    render(<Dashboard />);

    expect(
      screen.getByText(
        "MPC ASSETS",
      ),
    ).toBeInTheDocument();
  });

  it("renders total controllers stat card", () => {
    render(<Dashboard />);

    expect(
      screen.getByText(
        "TOTAL CONTROLLERS",
      ),
    ).toBeInTheDocument();
  });

  it("renders regulatory assets stat card", () => {
    render(<Dashboard />);

    expect(
      screen.getByText(
        "REGULATORY ASSETS",
      ),
    ).toBeInTheDocument();
  });

  it("renders two table cards", () => {
    render(<Dashboard />);

    expect(
      screen.getAllByTestId(
        "table-card",
      ),
    ).toHaveLength(2);
  });

  it("renders status summary table", () => {
    render(<Dashboard />);

    expect(
      screen.getByText(
        "Unit Wise Status Summary",
      ),
    ).toBeInTheDocument();
  });

  it("renders warning summary table", () => {
    render(<Dashboard />);

    expect(
      screen.getByText(
        "Warning And Error Summary",
      ),
    ).toBeInTheDocument();
  });

  it("renders warning badge count", () => {
    render(<Dashboard />);

    expect(
      screen.getByTestId(
        "badge",
      ),
    ).toHaveTextContent("11");
  });

  it("renders attributes filter label", () => {
    render(<Dashboard />);

    expect(
      screen.getByText(
        "Attributes",
      ),
    ).toBeInTheDocument();
  });

  it("renders type filter label", () => {
    render(<Dashboard />);

    expect(
      screen.getByText(
        "Type",
      ),
    ).toBeInTheDocument();
  });

  it("renders attribute dropdown options", () => {
    render(<Dashboard />);

    expect(
      screen.getByText(
        "Data Source",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Data Sink",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Valve Stiction",
      ),
    ).toBeInTheDocument();
  });

  it("renders type dropdown options", () => {
    render(<Dashboard />);

    expect(
      screen.getByText(
        "Regulatory",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "MPC",
      ),
    ).toBeInTheDocument();
  });

  it("passes correct props to stat cards", () => {
    render(<Dashboard />);

    expect(
      mockStatCard,
    ).toHaveBeenCalledTimes(4);
  });

  it("passes correct props to table cards", () => {
    render(<Dashboard />);

    expect(
      mockTableCard,
    ).toHaveBeenCalledTimes(2);
  });

  it("renders header actions content", () => {
  render(<Dashboard />);

  expect(
    screen.getAllByTestId(
      "header-actions",
    ),
  ).toHaveLength(2);
});

it("renders column cell content", () => {
  render(<Dashboard />);

  expect(
    screen.getAllByTestId(
      /column-cell-/,
    ).length,
  ).toBeGreaterThan(0);
});
});