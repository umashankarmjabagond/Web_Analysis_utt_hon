import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../test";

import CalculatedKpisAndErrors from "./CalculatedKpisAndErrors";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        CALCULATED_KPIS_TITLE: "Calculated KPIs",
        CALCULATED_KPIS_ERRORS_TITLE: "Errors",
        CALCULATED_KPIS_NO_ERRORS: "No errors found",
      };

      return translations[key] ?? key;
    },
  }),
}));

describe("CalculatedKpisAndErrors", () => {
  it("renders section headers", () => {
    render(<CalculatedKpisAndErrors />);

    expect(screen.getByText("Calculated KPIs")).toBeInTheDocument();

    expect(screen.getByText("Errors")).toBeInTheDocument();
  });

  it("renders default KPI data", () => {
    render(<CalculatedKpisAndErrors />);

    expect(screen.getByText("KPI 1")).toBeInTheDocument();

    expect(screen.getByText("124.5")).toBeInTheDocument();

    expect(screen.getByText("KPI 8")).toBeInTheDocument();

    expect(screen.getByText("77.7")).toBeInTheDocument();
  });

  it("renders custom KPI list", () => {
    const kpis = [
      {
        name: "Revenue",
        value: "1000",
      },
      {
        name: "Profit",
        value: "500",
      },
    ];

    render(<CalculatedKpisAndErrors kpis={kpis} />);

    expect(screen.getByText("Revenue")).toBeInTheDocument();

    expect(screen.getByText("1000")).toBeInTheDocument();

    expect(screen.getByText("Profit")).toBeInTheDocument();

    expect(screen.getByText("500")).toBeInTheDocument();
  });

  it("renders all KPI items", () => {
    const kpis = [
      {
        name: "KPI A",
        value: "1",
      },
      {
        name: "KPI B",
        value: "2",
      },
      {
        name: "KPI C",
        value: "3",
      },
    ];

    render(<CalculatedKpisAndErrors kpis={kpis} />);

    expect(screen.getByText("KPI A")).toBeInTheDocument();

    expect(screen.getByText("KPI B")).toBeInTheDocument();

    expect(screen.getByText("KPI C")).toBeInTheDocument();
  });

  it("shows no errors message when errors array is empty", () => {
    render(<CalculatedKpisAndErrors errors={[]} />);

    expect(screen.getByText("No errors found")).toBeInTheDocument();
  });

  it("uses default errors when not provided", () => {
    render(<CalculatedKpisAndErrors />);

    expect(screen.getByText("No errors found")).toBeInTheDocument();
  });

  it("renders error messages", () => {
    const errors = ["Error 1", "Error 2"];

    render(<CalculatedKpisAndErrors errors={errors} />);

    expect(screen.getByText("Error 1")).toBeInTheDocument();

    expect(screen.getByText("Error 2")).toBeInTheDocument();
  });

  it("does not render no errors message when errors exist", () => {
    render(<CalculatedKpisAndErrors errors={["Validation Error"]} />);

    expect(screen.queryByText("No errors found")).not.toBeInTheDocument();

    expect(screen.getByText("Validation Error")).toBeInTheDocument();
  });

  it("renders multiple error messages", () => {
    render(
      <CalculatedKpisAndErrors
        errors={["First Error", "Second Error", "Third Error"]}
      />,
    );

    expect(screen.getByText("First Error")).toBeInTheDocument();

    expect(screen.getByText("Second Error")).toBeInTheDocument();

    expect(screen.getByText("Third Error")).toBeInTheDocument();
  });

  it("renders with empty KPI array", () => {
    render(<CalculatedKpisAndErrors kpis={[]} />);

    expect(screen.getByText("Calculated KPIs")).toBeInTheDocument();

    expect(screen.getByText("Errors")).toBeInTheDocument();

    expect(screen.getByText("No errors found")).toBeInTheDocument();

    expect(screen.queryByText("KPI 1")).not.toBeInTheDocument();
  });
});
