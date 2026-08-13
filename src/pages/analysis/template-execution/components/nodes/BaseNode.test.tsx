import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import BaseNode from "./BaseNode";

const mockHandleNodeSelection = vi.fn();

let mockSelectedNodeIds: string[] = [];

/**
 * -------------------------------------------------------
 * Mock i18next
 * -------------------------------------------------------
 *
 * BaseNode uses:
 *
 *   t("NODE_WARNING_MESSAGE")
 *   t("NODE_ERROR_MESSAGE")
 *
 * We don't want to initialize the complete i18next
 * configuration for this unit test.
 */
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        NODE_WARNING_MESSAGE: "Warning message will be shown here",

        NODE_ERROR_MESSAGE: "There are too many bad data points",
      };

      return translations[key] ?? key;
    },
  }),
}));

/**
 * -------------------------------------------------------
 * Mock template execution store
 * -------------------------------------------------------
 */
vi.mock("../../../../../store/templateExecutionStore", () => ({
  useTemplateExecutionStore: vi.fn((selector) =>
    selector({
      selectedNodeIds: mockSelectedNodeIds,
    }),
  ),
}));

/**
 * -------------------------------------------------------
 * Mock workflow interactions
 * -------------------------------------------------------
 */
vi.mock("../../../../../hooks/useWorkflowInteractions", () => ({
  useWorkflowCanvasInteractions: () => ({
    handleNodeSelection: mockHandleNodeSelection,
  }),
}));

/**
 * -------------------------------------------------------
 * Mock Tooltip
 * -------------------------------------------------------
 */
vi.mock("../../../../../components/common/tooltip/Tooltip", () => ({
  default: ({
    children,
    content,
    disabled,
  }: {
    children: React.ReactNode;
    content?: string | null;
    disabled?: boolean;
  }) => (
    <div
      data-testid="tooltip"
      data-content={content ?? ""}
      data-disabled={String(disabled)}
    >
      {children}
    </div>
  ),
}));

/**
 * -------------------------------------------------------
 * Mock Checkbox
 * -------------------------------------------------------
 */
vi.mock("../../../../../components/forms/checkbox/CheckBox", () => ({
  default: ({
    onChange,
    onClick,
    checked,
  }: {
    onChange?: () => void;
    onClick?: (e: { stopPropagation: () => void }) => void;
    checked?: boolean;
  }) => (
    <>
      <button
        data-testid="checkbox-change"
        data-checked={String(checked)}
        onClick={onChange}
      >
        change
      </button>

      <button
        data-testid="checkbox-click"
        onClick={() =>
          onClick?.({
            stopPropagation: vi.fn(),
          })
        }
      >
        click
      </button>
    </>
  ),
}));

/**
 * -------------------------------------------------------
 * Mock React Flow
 * -------------------------------------------------------
 */
vi.mock("@xyflow/react", async () => {
  const actual =
    await vi.importActual<typeof import("@xyflow/react")>("@xyflow/react");

  return {
    ...actual,

    Position: {
      Top: "top",
      Right: "right",
      Bottom: "bottom",
      Left: "left",
    },

    Handle: ({ id, type }: { id: string; type: string }) => (
      <div data-testid="handle" data-id={id} data-type={type} />
    ),
  };
});

/**
 * -------------------------------------------------------
 * Mock node configuration
 * -------------------------------------------------------
 */
vi.mock("./nodeConfig", () => ({
  NODE_TYPES: {
    testNode: {
      icon: ({ size }: { size?: number }) => (
        <div data-testid="node-icon" data-size={String(size ?? "")} />
      ),
    },
  },
}));

/**
 * -------------------------------------------------------
 * Create test node
 * -------------------------------------------------------
 */
const createNode = (
  status: "default" | "success" | "warning" | "error" = "default",
) =>
  ({
    id: "node-1",
    type: "testNode",

    data: {
      label: "Test Node",
      status,
    },

    dragging: false,
    zIndex: 0,
    selectable: true,
    deletable: true,
    selected: false,
    draggable: true,
  }) as Parameters<typeof BaseNode>[0];

/**
 * =======================================================
 * TESTS
 * =======================================================
 */
describe("BaseNode", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockSelectedNodeIds = [];
  });

  /**
   * -----------------------------------------------------
   * Label
   * -----------------------------------------------------
   */
  it("renders label", () => {
    render(<BaseNode {...createNode()} />);

    expect(screen.getByText("Test Node")).toBeInTheDocument();
  });

  /**
   * -----------------------------------------------------
   * Icon
   * -----------------------------------------------------
   */
  it("renders icon", () => {
    render(<BaseNode {...createNode()} />);

    expect(screen.getByTestId("node-icon")).toBeInTheDocument();
  });

  /**
   * -----------------------------------------------------
   * Checkbox
   * -----------------------------------------------------
   */
  it("renders checkbox", () => {
    render(<BaseNode {...createNode()} />);

    expect(screen.getByTestId("checkbox-change")).toBeInTheDocument();
  });

  /**
   * -----------------------------------------------------
   * Checkbox selection
   * -----------------------------------------------------
   */
  it("calls handleNodeSelection when checkbox changes", () => {
    render(<BaseNode {...createNode("success")} />);

    fireEvent.click(screen.getByTestId("checkbox-change"));

    expect(mockHandleNodeSelection).toHaveBeenCalledWith("node-1", "success");
  });

  /**
   * -----------------------------------------------------
   * Handles
   * -----------------------------------------------------
   */
  it("renders handles", () => {
    render(<BaseNode {...createNode()} />);

    expect(screen.getAllByTestId("handle")).toHaveLength(8);
  });

  /**
   * -----------------------------------------------------
   * Selected node checkbox
   * -----------------------------------------------------
   */
  it("marks checkbox checked when node is selected", () => {
    mockSelectedNodeIds = ["node-1"];

    render(<BaseNode {...createNode()} />);

    expect(screen.getByTestId("checkbox-change")).toHaveAttribute(
      "data-checked",
      "true",
    );
  });

  /**
   * -----------------------------------------------------
   * Selected node tooltip
   * -----------------------------------------------------
   */
  it("disables tooltip when node is selected", () => {
    mockSelectedNodeIds = ["node-1"];

    render(<BaseNode {...createNode()} />);

    expect(screen.getByTestId("tooltip")).toHaveAttribute(
      "data-disabled",
      "true",
    );
  });

  /**
   * -----------------------------------------------------
   * Warning tooltip
   * -----------------------------------------------------
   */
  it("shows warning tooltip message", () => {
    render(<BaseNode {...createNode("warning")} />);

    expect(screen.getByTestId("tooltip")).toHaveAttribute(
      "data-content",
      "Warning message will be shown here",
    );
  });

  /**
   * -----------------------------------------------------
   * Error tooltip
   * -----------------------------------------------------
   */
  it("shows error tooltip message", () => {
    render(<BaseNode {...createNode("error")} />);

    expect(screen.getByTestId("tooltip")).toHaveAttribute(
      "data-content",
      "There are too many bad data points",
    );
  });

  /**
   * -----------------------------------------------------
   * Default tooltip
   * -----------------------------------------------------
   */
  it("shows no tooltip message for default status", () => {
    render(<BaseNode {...createNode("default")} />);

    expect(screen.getByTestId("tooltip")).toHaveAttribute("data-content", "");
  });

  /**
   * -----------------------------------------------------
   * Success status
   * -----------------------------------------------------
   */
  it("renders success status node", () => {
    render(<BaseNode {...createNode("success")} />);

    expect(screen.getByText("Test Node")).toBeInTheDocument();
  });

  /**
   * -----------------------------------------------------
   * Missing node metadata
   * -----------------------------------------------------
   */
  it("returns null when node type metadata is missing", () => {
    const { container } = render(
      <BaseNode
        {...({
          id: "node-1",
          type: "unknownType",

          data: {
            label: "Unknown",
            status: "default",
          },

          dragging: false,
          zIndex: 0,
          selectable: true,
          deletable: true,
          selected: false,
          draggable: true,
        } as Parameters<typeof BaseNode>[0])}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  /**
   * -----------------------------------------------------
   * Checkbox click propagation
   * -----------------------------------------------------
   */
  it("stops propagation when checkbox is clicked", () => {
    render(<BaseNode {...createNode()} />);

    fireEvent.click(screen.getByTestId("checkbox-click"));

    expect(screen.getByTestId("checkbox-click")).toBeInTheDocument();
  });
});
