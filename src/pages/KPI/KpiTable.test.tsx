import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen } from "../../test";
import KpiTable from "./KpiTable";

const mockSpreadsheetTable = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { tag?: string }) => {
      const translations: Record<string, string> = {
        WORKFLOW_VIEW_DATA_TITLE: "View Data for",
      };

      if (key === "WORKFLOW_VIEW_DATA_TITLE") {
        return `${translations[key]} ${options?.tag ?? ""} Data Preprocessing`;
      }

      return translations[key] ?? key;
    },
  }),
}));

vi.mock("../../components/tables/SpreadsheetTable", () => ({
  default: ({ data }: { data: Record<string, unknown>[] }) => {
    mockSpreadsheetTable(data);

    return <div data-testid="spreadsheet-table">Spreadsheet Table</div>;
  },
}));

describe("KpiTable", () => {
  beforeEach(() => {
    mockSpreadsheetTable.mockClear();
  });

  it("renders the page heading", () => {
    render(<KpiTable />);

    expect(
      screen.getByText("View Data for 56-FFC618 Data Preprocessing"),
    ).toBeInTheDocument();
  });

  it("renders SpreadsheetTable component", () => {
    render(<KpiTable />);

    expect(screen.getByTestId("spreadsheet-table")).toBeInTheDocument();
  });

  it("passes data to SpreadsheetTable", () => {
    render(<KpiTable />);

    expect(mockSpreadsheetTable).toHaveBeenCalledTimes(1);

    expect(Array.isArray(mockSpreadsheetTable.mock.calls[0][0])).toBe(true);
  });

  it("passes all table rows", () => {
    render(<KpiTable />);

    const tableData = mockSpreadsheetTable.mock.calls[0][0] as Record<
      string,
      unknown
    >[];

    expect(tableData).toHaveLength(20);
  });

  it("passes first row correctly", () => {
    render(<KpiTable />);

    const tableData = mockSpreadsheetTable.mock.calls[0][0] as Record<
      string,
      unknown
    >[];

    expect(tableData[0]).toEqual({
      Tag: "56-FFC618",
      PV: 52.31,
      SP: 50,
      OP: 44.2,
      Mode: "AUTO",
      Status: "Running",
      Error: 2.31,
      Quality: "Good",
      Timestamp: "09:45:01",
      Unit: "%",
      Min: 0,
      Max: 100,
      Alarm: "None",
    });
  });

  it("contains expected columns", () => {
    render(<KpiTable />);

    const tableData = mockSpreadsheetTable.mock.calls[0][0] as Record<
      string,
      unknown
    >[];

    const firstRow = tableData[0];

    expect(firstRow).toHaveProperty("Tag");
    expect(firstRow).toHaveProperty("PV");
    expect(firstRow).toHaveProperty("SP");
    expect(firstRow).toHaveProperty("OP");
    expect(firstRow).toHaveProperty("Mode");
    expect(firstRow).toHaveProperty("Status");
    expect(firstRow).toHaveProperty("Error");
    expect(firstRow).toHaveProperty("Quality");
    expect(firstRow).toHaveProperty("Timestamp");
    expect(firstRow).toHaveProperty("Unit");
    expect(firstRow).toHaveProperty("Min");
    expect(firstRow).toHaveProperty("Max");
    expect(firstRow).toHaveProperty("Alarm");
  });

  it("passes rows with expected tag values", () => {
    render(<KpiTable />);

    const tableData = mockSpreadsheetTable.mock.calls[0][0] as Record<
      string,
      unknown
    >[];

    expect(tableData.every((row) => row.Tag === "56-FFC618")).toBe(true);
  });

  it("passes KPI values to SpreadsheetTable", () => {
    render(<KpiTable />);

    const tableData = mockSpreadsheetTable.mock.calls[0][0] as Record<
      string,
      unknown
    >[];

    expect(tableData[0].PV).toBe(52.31);
    expect(tableData[0].SP).toBe(50);
    expect(tableData[0].OP).toBe(44.2);
  });

  it("passes timestamp values correctly", () => {
    render(<KpiTable />);

    const tableData = mockSpreadsheetTable.mock.calls[0][0] as Record<
      string,
      unknown
    >[];

    expect(tableData.some((row) => row.Timestamp === "09:45:01")).toBe(true);

    expect(tableData.some((row) => row.Timestamp === "09:45:05")).toBe(true);
  });
});
