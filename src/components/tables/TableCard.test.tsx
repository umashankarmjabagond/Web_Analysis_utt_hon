import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TableCardProps } from "../../types/dashboardTypes";
import TableCard from "./TableCard";
import type { ColumnDef } from "@tanstack/react-table";

// -----------------------------------------------------------------------------
// Mock Table Component
// -----------------------------------------------------------------------------

const { tableSpy } = vi.hoisted(() => ({
  tableSpy: vi.fn(),
}));

vi.mock("./Table", () => ({
  default: (props: unknown) => {
    tableSpy(props);

    return <div data-testid="mock-table">Mock Table</div>;
  },
}));

// -----------------------------------------------------------------------------
// Mock Types
// -----------------------------------------------------------------------------

type MockRow = {
  id: number;
};

// -----------------------------------------------------------------------------
// Test Data
// -----------------------------------------------------------------------------

const columns: ColumnDef<MockRow>[] = [];
const data: MockRow[] = [];

const defaultProps: TableCardProps<MockRow> = {
  title: "Status Summary",
  columns,
  data,
};

// -----------------------------------------------------------------------------
// Test Helper
// -----------------------------------------------------------------------------

const setup = (props: Partial<TableCardProps<MockRow>> = {}) =>
  render(<TableCard {...defaultProps} {...props} />);

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe("TableCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    // Test 1: Verify that the component renders the provided title.
    it("renders the title", () => {
      setup();

      expect(screen.getByText("Status Summary")).toBeInTheDocument();
    });

    // Test 2: Verify that the Table component is rendered.
    it("renders the Table component", () => {
      setup();

      expect(screen.getByTestId("mock-table")).toBeInTheDocument();
    });
  });

  describe("Conditional Rendering", () => {
    // Test 3: Verify that the badge is displayed when the badge prop is provided.
    it("renders the badge when badge prop is provided", () => {
      setup({
        badge: 5,
      });

      expect(screen.getByText("5")).toBeInTheDocument();
    });

    // Test 4: Verify that the badge is not displayed when the badge prop is omitted.
    it("does not render the badge when badge prop is not provided", () => {
      setup();

      expect(screen.queryByText("5")).not.toBeInTheDocument();
    });

    // Test 5: Verify that header actions are rendered when provided.
    it("renders header actions when provided", () => {
      setup({
        headerActions: <button>Filter</button>,
      });

      expect(
        screen.getByRole("button", {
          name: "Filter",
        }),
      ).toBeInTheDocument();
    });

    // Test 6: Verify that the header actions container is not rendered when no header actions are provided.
    it("does not render header actions when not provided", () => {
      setup();

      expect(
        screen.queryByRole("button", {
          name: "Filter",
        }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    // Test 7: Verify that a custom height class is applied to the root container.
    it("applies custom height class", () => {
      const { container } = setup({
        height: "h-[500px]",
      });

      expect(container.firstChild).toHaveClass("h-[500px]");
    });

    // Test 8: Verify that a custom border class is applied to the root container.
    it("applies custom border class", () => {
      const { container } = setup({
        border: "border-red-500",
      });

      expect(container.firstChild).toHaveClass("border-red-500");
    });

    // Test 9: Verify that a custom className is applied to the root container.
    it("applies custom className", () => {
      const { container } = setup({
        className: "custom-card",
      });

      expect(container.firstChild).toHaveClass("custom-card");
    });
  });

  describe("Table Integration", () => {
    // Test 10: Verify that the columns prop is passed to the Table component.
    it("passes columns to Table", () => {
      setup();

      expect(tableSpy).toHaveBeenCalled();

      expect(tableSpy.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          columns,
        }),
      );
    });

    // Test 11: Verify that the data prop is passed to the Table component.
    it("passes data to Table", () => {
      setup();

      expect(tableSpy.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          data,
        }),
      );
    });

    // Test 12: Verify that stickyHeader is always passed as true to the Table component.
    it("passes stickyHeader as true", () => {
      setup();

      expect(tableSpy.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          stickyHeader: true,
        }),
      );
    });

    // Test 13: Verify that zebraStripes is always passed as true to the Table component.
    it("passes zebraStripes as true", () => {
      setup();

      expect(tableSpy.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          zebraStripes: true,
        }),
      );
    });
  });
});
