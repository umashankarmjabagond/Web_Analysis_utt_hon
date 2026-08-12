import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";

import ExecutionNodeDrawer from "./ExecutionNodeDrawer";

const mockSetNodeDrawerOpen = vi.fn();

let mockIsNodeDrawerOpen = true;

vi.mock(
  "../../../../store/templateExecutionStore",
  () => ({
    useTemplateExecutionStore: vi.fn(
      (selector) =>
        selector({
          isNodeDrawerOpen:
            mockIsNodeDrawerOpen,
          setNodeDrawerOpen:
            mockSetNodeDrawerOpen,
        }),
    ),
  }),
);

vi.mock(
  "../../../../components/drawer/Drawer",
  () => ({
    default: ({
      children,
      title,
      onClose,
      opened,
    }: {
      children: ReactNode;
      title: ReactNode;
      onClose: () => void;
      opened: boolean;
    }) => (
      <div
        data-testid="drawer"
        data-opened={String(opened)}
      >
        <button
          data-testid="drawer-close"
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
      onTabChange: (
        id: string,
      ) => void;
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
        KpiTable
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
  "../../../KPI/Connections",
  () => ({
    default: () => (
      <div data-testid="connections">
        Connections
      </div>
    ),
  }),
);

vi.mock(
  "../../../KPI/Properties",
  () => ({
    default: ({
      onCancel,
    }: {
      onCancel?: () => void;
    }) => (
      <div
        data-testid="properties"
      >
        <button
          data-testid="cancel-properties"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    ),
  }),
);

describe(
  "ExecutionNodeDrawer",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();

      mockIsNodeDrawerOpen =
        true;
    });

    it("renders drawer", () => {
      render(
        <ExecutionNodeDrawer />,
      );

      expect(
        screen.getByTestId(
          "drawer",
        ),
      ).toBeInTheDocument();
    });

    it("renders tabs", () => {
      render(
        <ExecutionNodeDrawer />,
      );

      expect(
        screen.getByTestId(
          "tabs",
        ),
      ).toBeInTheDocument();
    });

    it("renders KpiTable by default", () => {
      render(
        <ExecutionNodeDrawer />,
      );

      expect(
        screen.getByTestId(
          "kpi-table",
        ),
      ).toBeInTheDocument();
    });

    it("switches to errors tab", () => {
      render(
        <ExecutionNodeDrawer />,
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: /calculated kpis and errors/i,
          },
        ),
      );

      expect(
        screen.getByTestId(
          "errors",
        ),
      ).toBeInTheDocument();
    });

    it("switches to properties tab", () => {
      render(
        <ExecutionNodeDrawer />,
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: /properties/i,
          },
        ),
      );

      expect(
        screen.getByTestId(
          "properties",
        ),
      ).toBeInTheDocument();
    });

    it("switches to connections tab", () => {
      render(
        <ExecutionNodeDrawer />,
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: /connections/i,
          },
        ),
      );

      expect(
        screen.getByTestId(
          "connections",
        ),
      ).toBeInTheDocument();
    });

    it("calls setNodeDrawerOpen when Drawer close is clicked", () => {
      render(
        <ExecutionNodeDrawer />,
      );

      fireEvent.click(
        screen.getByTestId(
          "drawer-close",
        ),
      );

      expect(
        mockSetNodeDrawerOpen,
      ).toHaveBeenCalledWith(
        false,
      );
    });

    it("calls setNodeDrawerOpen when Properties cancel is clicked", () => {
      render(
        <ExecutionNodeDrawer />,
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: /properties/i,
          },
        ),
      );

      fireEvent.click(
        screen.getByTestId(
          "cancel-properties",
        ),
      );

      expect(
        mockSetNodeDrawerOpen,
      ).toHaveBeenCalledWith(
        false,
      );
    });

    it("passes opened=true to Drawer", () => {
      render(
        <ExecutionNodeDrawer />,
      );

      expect(
        screen.getByTestId(
          "drawer",
        ),
      ).toHaveAttribute(
        "data-opened",
        "true",
      );
    });

    it("passes opened=false to Drawer", () => {
      mockIsNodeDrawerOpen =
        false;

      render(
        <ExecutionNodeDrawer />,
      );

      expect(
        screen.getByTestId(
          "drawer",
        ),
      ).toHaveAttribute(
        "data-opened",
        "false",
      );
    });

    it("does not render active component when drawer is closed", () => {
      mockIsNodeDrawerOpen =
        false;

      render(
        <ExecutionNodeDrawer />,
      );

      expect(
        screen.queryByTestId(
          "kpi-table",
        ),
      ).not.toBeInTheDocument();
    });
  },
);