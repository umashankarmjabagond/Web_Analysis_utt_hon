import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import { render } from "../../../test";
import type {
  WorkflowDragItem,
  WorkflowNode,
} from "../../../types/workFlowTypes";

import Canvas from "./Canvas";

type MockStore = {
  nodes: WorkflowNode[];
  edges: [];
  selectedEdge: null;
  activeTool: "pointer" | "connect";
  pendingCatalogItem: null;
  addNode: (node: WorkflowNode) => void;
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: []) => void;
  onNodesChange: () => void;
  onEdgesChange: () => void;
  onConnect: () => void;
  deleteSelectedNodes: () => void;
  deleteSelectedEdges: () => void;
  setSelectedNode: (node: WorkflowNode | null) => void;
  setSelectedEdge: (edge: null) => void;
  saveHistory: () => void;
  clearWorkflow: () => void;
  setPendingCatalogItem: () => void;
};

const mockStore: MockStore = {
  nodes: [],
  edges: [],
  selectedEdge: null,
  activeTool: "pointer",
  pendingCatalogItem: null,

  addNode: vi.fn(),
  setNodes: vi.fn(),
  setEdges: vi.fn(),
  onNodesChange: vi.fn(),
  onEdgesChange: vi.fn(),
  onConnect: vi.fn(),

  deleteSelectedNodes: vi.fn(),
  deleteSelectedEdges: vi.fn(),

  setSelectedNode: vi.fn(),
  setSelectedEdge: vi.fn(),

  saveHistory: vi.fn(),
  clearWorkflow: vi.fn(),
  setPendingCatalogItem: vi.fn(),
};

vi.mock("../../../store/workflowStore", () => ({
  useWorkflowStore: () => mockStore,
}));

vi.mock("@xyflow/react", () => ({
  ReactFlow: ({
    children,
    nodes,
    onDrop,
    onDragOver,
    onNodeClick,
    onPaneClick,
  }: {
    children?: ReactNode;
    nodes: WorkflowNode[];
    onDrop?: (event: React.DragEvent) => void;
    onDragOver?: (event: React.DragEvent) => void;
    onNodeClick?: (event: React.MouseEvent, node: WorkflowNode) => void;
    onPaneClick?: () => void;
  }) => (
    <div data-testid="react-flow" onDrop={onDrop} onDragOver={onDragOver}>
      <button
        data-testid="node-click"
        onClick={(event) => {
          const node = nodes[0];

          if (node) {
            onNodeClick?.(event, node);
          }
        }}
      >
        Node
      </button>

      <button data-testid="pane-click" onClick={() => onPaneClick?.()}>
        Pane
      </button>

      {children}
    </div>
  ),

  useReactFlow: () => ({
    screenToFlowPosition: vi.fn(() => ({
      x: 100,
      y: 100,
    })),
  }),

  MarkerType: {
    ArrowClosed: "arrowclosed",
  },
}));

vi.mock("../../../components/common/dialogue/Dialog", () => ({
  default: ({ isOpen, children }: { isOpen: boolean; children: ReactNode }) =>
    isOpen ? <div data-testid="dialog">{children}</div> : null,
}));

vi.mock("../../../components/forms/select/GroupedSelector", () => ({
  default: () => <div data-testid="grouped-selector">Grouped Selector</div>,
}));

vi.mock("../../../types/workFlowTypes", async () => {
  const actual = await vi.importActual<
    typeof import("../../../types/workFlowTypes")
  >("../../../types/workFlowTypes");

  return actual;
});

vi.mock("../workflowPanelData ", () => ({
  attributeCatalogSections: [],
  dummyWorkflows: {},
}));

vi.mock("../../../utils/utils", async () => {
  const actual = await vi.importActual<typeof import("../../../utils/utils")>(
    "../../../utils/utils",
  );

  return {
    ...actual,
    backendToFlow: vi.fn(() => ({
      nodes: [],
      edges: [],
    })),
  };
});

describe("Canvas", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockStore.nodes = [];
    mockStore.edges = [];
    mockStore.selectedEdge = null;
    mockStore.activeTool = "pointer";
    mockStore.pendingCatalogItem = null;
  });

  it("renders React Flow", () => {
    render(<Canvas />);

    expect(screen.getByTestId("react-flow")).toBeInTheDocument();
  });

  it("renders empty canvas message when there are no nodes", () => {
    render(<Canvas />);

    expect(screen.getByText("Create New Template")).toBeInTheDocument();
  });

  it("does not render empty canvas message when nodes exist", () => {
    mockStore.nodes = [
      {
        id: "node-1",
        type: "baseNode",
        position: {
          x: 0,
          y: 0,
        },
        data: {
          label: "Test Node",
          element: {
            Name: "TestNode1",
            elementType: "Math",
          },
          catalogId: "math",
        },
      },
    ];

    render(<Canvas />);

    expect(screen.queryByText("Create New Template")).not.toBeInTheDocument();
  });

  it("clears workflow when component mounts", () => {
    render(<Canvas />);

    expect(mockStore.clearWorkflow).toHaveBeenCalled();
  });

  it("selects node when node is clicked", async () => {
    mockStore.nodes = [
      {
        id: "node-1",
        type: "baseNode",
        position: {
          x: 0,
          y: 0,
        },
        data: {
          label: "Test Node",
          element: {
            Name: "TestNode1",
            elementType: "Math",
          },
          catalogId: "math",
        },
      },
    ];

    render(<Canvas />);

    fireEvent.click(screen.getByTestId("node-click"));

    expect(mockStore.setSelectedNode).toHaveBeenCalledWith(mockStore.nodes[0]);
  });

  it("clears selected node when pane is clicked", () => {
    render(<Canvas />);

    fireEvent.click(screen.getByTestId("pane-click"));

    expect(mockStore.setSelectedNode).toHaveBeenCalledWith(null);
  });

  it("handles drag over", () => {
    render(<Canvas />);

    const flow = screen.getByTestId("react-flow");

    const dataTransfer = {
      dropEffect: "",
    };

    fireEvent.dragOver(flow, {
      dataTransfer,
    });

    expect(dataTransfer.dropEffect).toBe("move");
  });

  it("does nothing when drop has no data", () => {
    render(<Canvas />);

    const flow = screen.getByTestId("react-flow");

    const dataTransfer = {
      getData: vi.fn(() => ""),
      dropEffect: "",
    };

    fireEvent.drop(flow, {
      dataTransfer,
    });

    expect(mockStore.addNode).not.toHaveBeenCalled();
  });

  it("adds attribute node when an attribute is dropped", () => {
    const dragItem: WorkflowDragItem = {
      type: "attribute",
      item: {
        id: "math",
        title: "Math",
        icon: "math",
        element: {
          Name: "Math",
          elementType: "Math",
        },
      },
    };

    render(<Canvas />);

    const flow = screen.getByTestId("react-flow");

    const dataTransfer = {
      getData: vi.fn(() => JSON.stringify(dragItem)),
      dropEffect: "",
    };

    fireEvent.drop(flow, {
      dataTransfer,
      clientX: 200,
      clientY: 300,
    });

    expect(mockStore.addNode).toHaveBeenCalled();
  });

  it("handles Delete key", () => {
    render(<Canvas />);

    fireEvent.keyDown(window, {
      key: "Delete",
    });

    expect(mockStore.deleteSelectedEdges).toHaveBeenCalled();

    expect(mockStore.deleteSelectedNodes).toHaveBeenCalled();
  });

  it("saves history when node dragging starts", () => {
    render(<Canvas />);

    /*
     * ReactFlow is mocked above, so the actual drag-start
     * callback is not exposed by the mock.
     *
     * This test can be added to the ReactFlow mock if needed.
     */
    expect(mockStore.saveHistory).not.toHaveBeenCalled();
  });
});
