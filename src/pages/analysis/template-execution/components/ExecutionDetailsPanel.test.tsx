import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ExecutionDetailsPanel from "./ExecutionDetailsPanel";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        TAB_VIEW_DATA: "View Data",
        TAB_CALCULATED_KPIS_ERRORS: "Calculated KPIs and Errors",
        TAB_PROPERTIES: "Properties",
        TAB_CONNECTIONS: "Connections",
      };

      return translations[key] ?? key;
    },
  }),
}));

vi.mock("../../../../components/drawer/Drawer", () => ({
  default: ({
    title,
    children,
    onClose,
  }: {
    title: React.ReactNode;
    children: React.ReactNode;
    onClose: () => void;
    variant?: string;
    opened?: boolean;
    className?: string;
  }) => (
    <div data-testid="drawer">
      <button type="button" data-testid="close-drawer" onClick={onClose}>
        Close
      </button>

      <div data-testid="drawer-title">{title}</div>

      <div data-testid="drawer-content">{children}</div>
    </div>
  ),
}));

vi.mock("../../../../components/common/tabs/Tabs", () => ({
  Tabs: ({
    items,
    activeTab,
    onTabChange,
  }: {
    items: {
      id: string;
      label: string;
    }[];
    activeTab: string;
    onTabChange: (id: string) => void;
    renderContent?: boolean;
  }) => (
    <div data-testid="tabs">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-selected={activeTab === item.id}
          onClick={() => onTabChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("../../../KPI/KpiTable", () => ({
  default: () => <div data-testid="kpi-table">Kpi Table</div>,
}));

vi.mock("../../../KPI/CalculatedKpisAndErrors", () => ({
  default: () => <div data-testid="errors">Errors</div>,
}));

vi.mock("../../../KPI/Properties", () => ({
  default: () => <div data-testid="properties">Properties</div>,
}));

vi.mock("../../../KPI/Connections", () => ({
  default: () => <div data-testid="connections">Connections</div>,
}));

describe("ExecutionDetailsPanel", () => {
  it("renders drawer", () => {
    render(<ExecutionDetailsPanel />);

    expect(screen.getByTestId("drawer")).toBeInTheDocument();
  });

  it("renders tabs", () => {
    render(<ExecutionDetailsPanel />);

    expect(screen.getByTestId("tabs")).toBeInTheDocument();
  });

  it("renders KpiTable by default", () => {
    render(<ExecutionDetailsPanel />);

    expect(screen.getByTestId("kpi-table")).toBeInTheDocument();

    expect(screen.queryByTestId("errors")).not.toBeInTheDocument();

    expect(screen.queryByTestId("properties")).not.toBeInTheDocument();

    expect(screen.queryByTestId("connections")).not.toBeInTheDocument();
  });

  it("switches to Calculated KPIs and Errors tab", () => {
    render(<ExecutionDetailsPanel />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /calculated kpis and errors/i,
      }),
    );

    expect(screen.getByTestId("errors")).toBeInTheDocument();

    expect(screen.queryByTestId("kpi-table")).not.toBeInTheDocument();
  });

  it("switches to Properties tab", () => {
    render(<ExecutionDetailsPanel />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /properties/i,
      }),
    );

    expect(screen.getByTestId("properties")).toBeInTheDocument();

    expect(screen.queryByTestId("kpi-table")).not.toBeInTheDocument();
  });

  it("switches to Connections tab", () => {
    render(<ExecutionDetailsPanel />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /connections/i,
      }),
    );

    expect(screen.getByTestId("connections")).toBeInTheDocument();

    expect(screen.queryByTestId("kpi-table")).not.toBeInTheDocument();
  });

  it("returns to View Data tab", () => {
    render(<ExecutionDetailsPanel />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /connections/i,
      }),
    );

    expect(screen.getByTestId("connections")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: /view data/i,
      }),
    );

    expect(screen.getByTestId("kpi-table")).toBeInTheDocument();

    expect(screen.queryByTestId("connections")).not.toBeInTheDocument();
  });

  it("handles drawer close action", () => {
    render(<ExecutionDetailsPanel />);

    expect(screen.getByTestId("drawer")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("close-drawer"));

    expect(screen.getByTestId("drawer")).toBeInTheDocument();
  });
});
