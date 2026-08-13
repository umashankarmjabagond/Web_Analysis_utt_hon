import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Dashboard from "./Dashboard";

const mockStatCard = vi.fn();
const mockTableCard = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        DASHBOARD_POWER_BOILER: "Power Boiler",
        DASHBOARD_AREA: "Area",

        DASHBOARD_TOTAL_UNITS: "TOTAL UNITS",
        DASHBOARD_MPC_ASSETS: "MPC ASSETS",
        DASHBOARD_TOTAL_CONTROLLERS: "TOTAL CONTROLLERS",
        DASHBOARD_REGULATORY_ASSETS: "REGULATORY ASSETS",

        DASHBOARD_UNIT_WISE_STATUS_SUMMARY: "Unit Wise Status Summary",

        DASHBOARD_WARNING_ERROR_SUMMARY: "Warning And Error Summary",

        TABLE_UNIT_NAME: "Unit Name",
        TABLE_TOTAL_CONTROLLERS: "Total Controllers",
        TABLE_GOOD: "Good",
        TABLE_WARNINGS: "Warnings",
        TABLE_ERRORS: "Errors",

        TABLE_CONTROLLER_NAME: "Controller Name",
        TABLE_ATTRIBUTE_NAME: "Attribute Name",
        TABLE_ERROR_MESSAGE: "Error Message",

        FILTER_ATTRIBUTES: "Attributes",
        FILTER_TYPE: "Type",
        FILTER_ALL: "All",
        FILTER_DATA_SOURCE: "Data Source",
        FILTER_DATA_SINK: "Data Sink",
        FILTER_VALVE_STICTION: "Valve Stiction",
        FILTER_REGULATORY: "Regulatory",
        FILTER_MPC: "MPC",
      };

      return translations[key] ?? key;
    },
  }),
}));

vi.mock("./components/StatCard", () => ({
  default: (props: {
    data: {
      title: string;
    };
  }) => {
    mockStatCard(props);

    return <div data-testid="stat-card">{props.data.title}</div>;
  },
}));

vi.mock("../../components/tables/TableCard", () => ({
  default: (props: {
    title: string;
    badge?: number;
    headerActions?: ReactNode;
    columns?: Array<{
      cell?: (context: { getValue: () => unknown }) => ReactNode;
    }>;
    data?: unknown[];
  }) => {
    mockTableCard(props);

    return (
      <div data-testid="table-card">
        <div data-testid="table-card-title">{props.title}</div>

        {props.columns?.map((column, index) => {
          if (!column.cell) {
            return null;
          }

          return (
            <div key={index} data-testid={`column-cell-${index}`}>
              {column.cell({
                getValue: () => 123,
              })}
            </div>
          );
        })}

        {props.badge !== undefined && (
          <div data-testid="badge">{props.badge}</div>
        )}

        {props.headerActions && (
          <div data-testid="header-actions">{props.headerActions}</div>
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

    expect(screen.getByText("Power Boiler")).toBeInTheDocument();
  });

  it("renders dashboard area badge", () => {
    render(<Dashboard />);

    expect(screen.getByText("Area")).toBeInTheDocument();
  });

  it("renders all stat cards", () => {
    render(<Dashboard />);

    expect(screen.getAllByTestId("stat-card")).toHaveLength(4);
  });

  it("renders total units stat card", () => {
    render(<Dashboard />);

    expect(screen.getByText("DASHBOARD_TOTAL_UNITS")).toBeInTheDocument();
  });

  it("renders MPC assets stat card", () => {
    render(<Dashboard />);

    expect(screen.getByText("DASHBOARD_MPC_ASSETS")).toBeInTheDocument();
  });

  it("renders total controllers stat card", () => {
    render(<Dashboard />);

    expect(screen.getByText("DASHBOARD_TOTAL_CONTROLLERS")).toBeInTheDocument();
  });

  it("renders regulatory assets stat card", () => {
    render(<Dashboard />);

    expect(screen.getByText("DASHBOARD_REGULATORY_ASSETS")).toBeInTheDocument();
  });

  it("renders two table cards", () => {
    render(<Dashboard />);

    expect(screen.getAllByTestId("table-card")).toHaveLength(2);
  });

  it("renders status summary table", () => {
    render(<Dashboard />);

    expect(screen.getByText("Unit Wise Status Summary")).toBeInTheDocument();
  });

  it("renders warning summary table", () => {
    render(<Dashboard />);

    expect(screen.getByText("Warning And Error Summary")).toBeInTheDocument();
  });

  it("renders warning badge count", () => {
    render(<Dashboard />);

    expect(screen.getByTestId("badge")).toHaveTextContent("11");
  });

  it("renders attributes filter label", () => {
    render(<Dashboard />);

    expect(screen.getByText("Attributes")).toBeInTheDocument();
  });

  it("renders type filter label", () => {
    render(<Dashboard />);

    expect(screen.getByText("Type")).toBeInTheDocument();
  });

  it("renders attribute dropdown options", () => {
    render(<Dashboard />);

    expect(screen.getByText("Data Source")).toBeInTheDocument();

    expect(screen.getByText("Data Sink")).toBeInTheDocument();

    expect(screen.getByText("Valve Stiction")).toBeInTheDocument();
  });

  it("renders type dropdown options", () => {
    render(<Dashboard />);

    expect(screen.getByText("Regulatory")).toBeInTheDocument();

    expect(screen.getByText("MPC")).toBeInTheDocument();
  });

  it("passes correct number of stat cards", () => {
    render(<Dashboard />);

    expect(mockStatCard).toHaveBeenCalledTimes(4);
  });

  it("passes correct number of table cards", () => {
    render(<Dashboard />);

    expect(mockTableCard).toHaveBeenCalledTimes(2);
  });

  it("passes status summary title to first table card", () => {
    render(<Dashboard />);

    expect(mockTableCard.mock.calls[0][0].title).toBe(
      "Unit Wise Status Summary",
    );
  });

  it("passes warning summary title to second table card", () => {
    render(<Dashboard />);

    expect(mockTableCard.mock.calls[1][0].title).toBe(
      "Warning And Error Summary",
    );
  });

  it("passes warning badge count to warning table", () => {
    render(<Dashboard />);

    expect(mockTableCard.mock.calls[1][0].badge).toBe(11);
  });

  it("passes columns to status summary table", () => {
    render(<Dashboard />);

    const props = mockTableCard.mock.calls[0][0];

    expect(props.columns).toBeDefined();

    expect(props.columns.length).toBe(5);
  });

  it("passes columns to warning summary table", () => {
    render(<Dashboard />);

    const props = mockTableCard.mock.calls[1][0];

    expect(props.columns).toBeDefined();

    expect(props.columns.length).toBe(5);
  });

  it("renders header actions content", () => {
    render(<Dashboard />);

    expect(screen.getAllByTestId("header-actions")).toHaveLength(2);
  });

  it("renders column cell content", () => {
    render(<Dashboard />);

    expect(screen.getAllByTestId(/column-cell-/)).not.toHaveLength(0);
  });

  it("renders status table cell badges", () => {
    render(<Dashboard />);

    const cells = screen.getAllByTestId(/column-cell-/);

    expect(cells.length).toBeGreaterThan(0);

    expect(screen.getAllByText("123").length).toBeGreaterThan(0);
  });

  it("passes data to both table cards", () => {
    render(<Dashboard />);

    const firstTableProps = mockTableCard.mock.calls[0][0];

    const secondTableProps = mockTableCard.mock.calls[1][0];

    expect(firstTableProps.data).toBeDefined();

    expect(secondTableProps.data).toBeDefined();

    expect(firstTableProps.data.length).toBe(5);

    expect(secondTableProps.data.length).toBe(20);
  });
});
