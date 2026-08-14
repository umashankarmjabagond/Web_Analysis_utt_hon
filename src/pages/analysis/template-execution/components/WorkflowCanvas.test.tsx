import React, { type ReactNode } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import WorkflowCanvas from "./WorkflowCanvas";

import type { Edge, Node } from "@xyflow/react";

const mockHandleNodeSelection = vi.fn();
const mockLoadMore = vi.fn();

const mockNodes: Node[] = [
  {
    id: "node-1",
    type: "customNode",
    position: {
      x: 100,
      y: 100,
    },
    data: {
      status: "success",
    },
  },
  {
    id: "header-node",
    type: "executionHeader",
    position: {
      x: 200,
      y: 200,
    },
    data: {},
  },
];

const mockEdges: Edge[] = [];

let mockParams: {
  template: string;
  itemId?: string;
} = {
  template: "template-1",
  itemId: "asset-1",
};

const renderWorkflowCanvas = (executionContext: "asset" | "unit" = "asset") =>
  render(<WorkflowCanvas executionContext={executionContext} />);

vi.mock("react-router-dom", () => ({
  useParams: () => mockParams,
}));

vi.mock("../../../../store/templateExecutionStore", () => ({
  useTemplateExecutionStore: vi.fn(
    (selector: (state: { nodes: Node[]; edges: Edge[] }) => unknown) =>
      selector({
        nodes: mockNodes,
        edges: mockEdges,
      }),
  ),
}));

vi.mock("../../../../hooks/useWorkflowInteractions", () => ({
  useWorkflowCanvasInteractions: () => ({
    handleNodeSelection: mockHandleNodeSelection,
  }),
}));

vi.mock("./ExecutionNodeDrawer", () => ({
  default: () => <div data-testid="node-drawer">Node Drawer</div>,
}));

vi.mock("./ExecutionDetailsPanel", () => ({
  default: () => <div data-testid="details-panel">Details Panel</div>,
}));

vi.mock("@xyflow/react", async () => {
  const actual =
    await vi.importActual<typeof import("@xyflow/react")>("@xyflow/react");

  type MockReactFlowProps = {
    onNodeClick?: (event: globalThis.MouseEvent, node: Node) => void;
    children?: ReactNode;
  };

  return {
    ...actual,

    ConnectionMode: {
      Loose: "Loose",
    },

    BackgroundVariant: {
      Dots: "Dots",
    },

    Background: () => <div data-testid="background" />,

    ReactFlow: ({ onNodeClick, children }: MockReactFlowProps) => (
      <div data-testid="react-flow">
        <button
          type="button"
          data-testid="normal-node"
          onClick={(event) => onNodeClick?.(event.nativeEvent, mockNodes[0])}
        >
          Normal Node
        </button>

        <button
          type="button"
          data-testid="header-node"
          onClick={(event) => onNodeClick?.(event.nativeEvent, mockNodes[1])}
        >
          Header Node
        </button>

        {children}
      </div>
    ),
  };
});

describe("WorkflowCanvas", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockParams = {
      template: "template-1",
      itemId: "asset-1",
    };
  });

  it("renders ReactFlow", () => {
    renderWorkflowCanvas();

    expect(screen.getByTestId("react-flow")).toBeInTheDocument();
  });

  it("renders ExecutionNodeDrawer", () => {
    renderWorkflowCanvas();

    expect(screen.getByTestId("node-drawer")).toBeInTheDocument();
  });

  it("renders details panel for asset context", () => {
    renderWorkflowCanvas("asset");

    expect(screen.getByTestId("details-panel")).toBeInTheDocument();
  });

  it("does not render details panel for unit context", () => {
    renderWorkflowCanvas("unit");

    expect(screen.queryByTestId("details-panel")).not.toBeInTheDocument();
  });

  it("renders background", () => {
    renderWorkflowCanvas();

    expect(screen.getByTestId("background")).toBeInTheDocument();
  });

  it("calls handleNodeSelection for normal node", () => {
    renderWorkflowCanvas();

    fireEvent.click(screen.getByTestId("normal-node"));

    expect(mockHandleNodeSelection).toHaveBeenCalledWith("node-1", "success");
  });

  it("does not call handleNodeSelection for executionHeader node", () => {
    renderWorkflowCanvas();

    fireEvent.click(screen.getByTestId("header-node"));

    expect(mockHandleNodeSelection).not.toHaveBeenCalled();
  });

  it("renders with node data present", () => {
    renderWorkflowCanvas();

    expect(screen.getByTestId("react-flow")).toBeInTheDocument();
  });

  it("uses unit fallback when itemId is undefined", () => {
    mockParams = {
      template: "template-1",
      itemId: undefined,
    };

    renderWorkflowCanvas("unit");

    expect(screen.getByTestId("react-flow")).toBeInTheDocument();
  });
});
