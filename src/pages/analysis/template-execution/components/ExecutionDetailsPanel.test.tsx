import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ExecutionDetailsPanel from "./ExecutionDetailsPanel";

vi.mock(
  "../../../../components/drawer/Drawer",
  () => ({
    default: ({
      title,
      children,
      onClose,
    }: {
      title: React.ReactNode;
      children: React.ReactNode;
      onClose: () => void;
    }) => (
      <div data-testid="drawer">
        <button
          data-testid="close-drawer"
          onClick={onClose}
        >
          Close
        </button>

        {title}
        {children}
      </div>
    ),
  }),
);

vi.mock(
  "../../../../components/common/tabs/Tabs",
  () => ({
    Tabs: ({
      items,
      onTabChange,
    }: {
      items: {
        id: string;
        label: string;
      }[];
      onTabChange: (id: string) => void;
    }) => (
      <div data-testid="tabs">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() =>
              onTabChange(item.id)
            }
          >
            {item.label}
          </button>
        ))}
      </div>
    ),
  }),
);

vi.mock(
  "../../../KPI/KpiTable",
  () => ({
    default: () => (
      <div data-testid="kpi-table">
        Kpi Table
      </div>
    ),
  }),
);

vi.mock(
  "../../../KPI/CalculatedKpisAndErrors",
  () => ({
    default: () => (
      <div data-testid="errors">
        Errors
      </div>
    ),
  }),
);

vi.mock(
  "../../../KPI/Properties",
  () => ({
    default: () => (
      <div data-testid="properties">
        Properties
      </div>
    ),
  }),
);

vi.mock(
  "../../../KPI/Connections",
  () => ({
    default: () => (
      <div data-testid="connections">
        Connections
      </div>
    ),
  }),
);

describe(
  "ExecutionDetailsPanel",
  () => {
    it("renders drawer", () => {
      render(
        <ExecutionDetailsPanel />,
      );

      expect(
        screen.getByTestId("drawer"),
      ).toBeInTheDocument();
    });

    it("renders tabs", () => {
      render(
        <ExecutionDetailsPanel />,
      );

      expect(
        screen.getByTestId("tabs"),
      ).toBeInTheDocument();
    });

    it("renders KpiTable by default", () => {
      render(
        <ExecutionDetailsPanel />,
      );

      expect(
        screen.getByTestId(
          "kpi-table",
        ),
      ).toBeInTheDocument();
    });

    it("switches to Calculated KPIs and Errors tab", () => {
      render(
        <ExecutionDetailsPanel />,
      );

      fireEvent.click(
        screen.getByRole("button", {
          name: /calculated kpis and errors/i,
        }),
      );

      expect(
        screen.getByTestId("errors"),
      ).toBeInTheDocument();
    });

    it("switches to Properties tab", () => {
      render(
        <ExecutionDetailsPanel />,
      );

      fireEvent.click(
        screen.getByRole("button", {
          name: /properties/i,
        }),
      );

      expect(
        screen.getByTestId(
          "properties",
        ),
      ).toBeInTheDocument();
    });

    it("switches to Connections tab", () => {
      render(
        <ExecutionDetailsPanel />,
      );

      fireEvent.click(
        screen.getByRole("button", {
          name: /connections/i,
        }),
      );

      expect(
        screen.getByTestId(
          "connections",
        ),
      ).toBeInTheDocument();
    });

    it("returns to View Data tab", () => {
      render(
        <ExecutionDetailsPanel />,
      );

      fireEvent.click(
        screen.getByRole("button", {
          name: /connections/i,
        }),
      );

      fireEvent.click(
        screen.getByRole("button", {
          name: /view data/i,
        }),
      );

      expect(
        screen.getByTestId(
          "kpi-table",
        ),
      ).toBeInTheDocument();
    });

    it("calls drawer onClose handler", () => {
  render(<ExecutionDetailsPanel />);

  fireEvent.click(
    screen.getByTestId(
      "close-drawer",
    ),
  );

  expect(
    screen.getByTestId(
      "drawer",
    ),
  ).toBeInTheDocument();
});

  },
);