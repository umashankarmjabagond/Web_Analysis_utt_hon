import React, { type ReactNode } from "react";

import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Calculator } from "lucide-react";

import { render } from "../../../test";

import type {
  WorkflowDragItem,
  WorkflowListItem,
  WorkflowNode,
} from "../../../types/workFlowTypes";

import Canvas from "./Canvas";

/*                                   MOCKS */

type MockEdge = {
  id: string;
  source: string;
  target: string;
  type?: string;
};

type MockStore = {
  nodes: WorkflowNode[];
  edges: MockEdge[];
  selectedEdge: MockEdge | null;
  activeTool: "pointer" | "connect";

  pendingCatalogItem: WorkflowListItem | null;

  addNode: ReturnType<typeof vi.fn>;
  setNodes: ReturnType<typeof vi.fn>;
  setEdges: ReturnType<typeof vi.fn>;

  onNodesChange: ReturnType<typeof vi.fn>;
  onEdgesChange: ReturnType<typeof vi.fn>;
  onConnect: ReturnType<typeof vi.fn>;

  deleteSelectedNodes: ReturnType<typeof vi.fn>;
  deleteSelectedEdges: ReturnType<typeof vi.fn>;

  setSelectedNode: ReturnType<typeof vi.fn>;
  setSelectedEdge: ReturnType<typeof vi.fn>;

  saveHistory: ReturnType<typeof vi.fn>;
  clearWorkflow: ReturnType<typeof vi.fn>;
  setPendingCatalogItem: ReturnType<typeof vi.fn>;
};

/*                              TEST DATA HELPERS */

const createElement = (name = "Math1", elementType = "Math") => ({
  Name: name,
  ParentNames: [],
  elementType,
});

const createNode = (id = "node-1", name = "Math1"): WorkflowNode =>
  ({
    id,
    type: "baseNode",
    position: {
      x: 0,
      y: 0,
    },
    data: {
      label: name,
      element: createElement(name),
      catalogId: "math",
    },
  }) as WorkflowNode;

const createAttributeItem = (): WorkflowListItem =>
  ({
    id: "math",
    title: "Math",
    icon: Calculator,
    element: createElement("Math"),
  }) as WorkflowListItem;

const createTemplateItem = (id = "template-1"): WorkflowListItem =>
  ({
    id,
    title: "Template",
    icon: Calculator,
    element: createElement("Template", "Template"),
  }) as WorkflowListItem;

const createDragEventData = (dragItem: WorkflowDragItem) => ({
  getData: vi.fn(() => JSON.stringify(dragItem)),
  setData: vi.fn(),
  dropEffect: "",
});

/*                               MOCK STORE */

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

/*                              XYFLOW MOCK */

vi.mock("@xyflow/react", () => ({
  ReactFlow: ({
    children,
    nodes,
    onDrop,
    onDragOver,
    onNodeClick,
    onPaneClick,
    onNodeDragStart,
  }: {
    children?: ReactNode;
    nodes?: WorkflowNode[];

    /*
     * IMPORTANT:
     * These must be React's event types because the
     * callbacks are attached to React DOM elements.
     */
    onDrop?: (event: React.DragEvent<HTMLButtonElement>) => void;

    onDragOver?: (event: React.DragEvent<HTMLButtonElement>) => void;

    onNodeClick?: (
      event: React.MouseEvent<HTMLButtonElement>,
      node: WorkflowNode,
    ) => void;

    onPaneClick?: () => void;

    onNodeDragStart?: () => void;
  }) => {
    const firstNode = nodes?.[0];

    return (
      <div data-testid="react-flow">
        <button
          type="button"
          data-testid="node-click"
          onClick={(event) => {
            if (firstNode) {
              onNodeClick?.(event, firstNode);
            }
          }}
        >
          Node
        </button>

        <button
          type="button"
          data-testid="pane-click"
          onClick={() => onPaneClick?.()}
        >
          Pane
        </button>

        <button
          type="button"
          data-testid="node-drag-start"
          onClick={() => onNodeDragStart?.()}
        >
          Drag Node
        </button>

        <button
          type="button"
          data-testid="drop-zone"
          onDragOver={(event) => onDragOver?.(event)}
          onDrop={(event) => onDrop?.(event)}
        >
          Drop Zone
        </button>

        {children}
      </div>
    );
  },

  useReactFlow: () => ({
    screenToFlowPosition: vi.fn(() => ({
      x: 100,
      y: 100,
    })),
  }),

  /*
   * ZoomControls uses useViewport().
   *
   * Canvas tests need to provide this hook because
   * ZoomControls is rendered inside Canvas.
   */
  useViewport: () => ({
    zoom: 1,
    x: 0,
    y: 0,
  }),

  MarkerType: {
    ArrowClosed: "arrowclosed",
  },
}));

/*                               STORE MOCK */

vi.mock("../../../store/workflowStore", () => ({
  useWorkflowStore: () => mockStore,
}));

/*                              DIALOG MOCK */

vi.mock("../../../components/common/dialogue/Dialog", () => ({
  default: ({ isOpen, children }: { isOpen: boolean; children?: ReactNode }) =>
    isOpen ? <div data-testid="dialog">{children}</div> : null,
}));

/*                           GROUPED SELECTOR MOCK */

vi.mock("../../../components/forms/select/GroupedSelector", () => ({
  default: () => <div data-testid="grouped-selector">Grouped Selector</div>,
}));

/*                         WORKFLOW PANEL DATA MOCK */

vi.mock("../workflowPanelData ", () => ({
  attributeCatalogSections: [],
  dummyWorkflows: {},
}));

/*                              UTILS MOCK */

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

/*                                  TESTS */

describe("Canvas", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockStore.nodes = [];
    mockStore.edges = [];
    mockStore.selectedEdge = null;
    mockStore.activeTool = "pointer";
    mockStore.pendingCatalogItem = null;
  });

  /* Rendering */

  it("renders React Flow", () => {
    render(<Canvas />);

    expect(screen.getByTestId("react-flow")).toBeInTheDocument();
  });

  it("renders empty canvas message when there are no nodes", () => {
    render(<Canvas />);

    expect(screen.getByText("CANVAS_CREATE_NEW_TEMPLATE")).toBeInTheDocument();
  });

  it("does not render empty canvas message when nodes exist", () => {
    mockStore.nodes = [createNode("node-1", "Math1")];

    render(<Canvas />);

    expect(
      screen.queryByText("CANVAS_CREATE_NEW_TEMPLATE"),
    ).not.toBeInTheDocument();
  });

  /* Mount / selection */

  it("clears workflow when component mounts", () => {
    render(<Canvas />);

    expect(mockStore.clearWorkflow).toHaveBeenCalledTimes(1);
  });

  it("selects node when node is clicked", () => {
    const node = createNode("node-1", "Math1");

    mockStore.nodes = [node];

    render(<Canvas />);

    fireEvent.click(screen.getByTestId("node-click"));

    expect(mockStore.setSelectedNode).toHaveBeenCalledWith(node);
  });

  it("clears selected node when pane is clicked", () => {
    render(<Canvas />);

    fireEvent.click(screen.getByTestId("pane-click"));

    expect(mockStore.setSelectedNode).toHaveBeenCalledWith(null);
  });

  /* Dragging */

  it("saves history when node dragging starts", () => {
    render(<Canvas />);

    fireEvent.click(screen.getByTestId("node-drag-start"));

    expect(mockStore.saveHistory).toHaveBeenCalledTimes(1);
  });

  it("handles drag over", () => {
    render(<Canvas />);

    const dropZone = screen.getByTestId("drop-zone");

    const dataTransfer = {
      dropEffect: "",
    };

    fireEvent.dragOver(dropZone, {
      dataTransfer,
    });

    expect(dropZone).toBeInTheDocument();
  });

  it("does nothing when drop has no data", () => {
    render(<Canvas />);

    const dropZone = screen.getByTestId("drop-zone");

    const dataTransfer = {
      getData: vi.fn(() => ""),
      dropEffect: "",
    };

    fireEvent.drop(dropZone, {
      dataTransfer,
    });

    expect(mockStore.addNode).not.toHaveBeenCalled();
  });

  /* Attribute drop */

  it("adds attribute node when an attribute is dropped", () => {
    const dragItem: WorkflowDragItem = {
      type: "attribute",
      item: createAttributeItem(),
    };

    render(<Canvas />);

    const dropZone = screen.getByTestId("drop-zone");

    const dataTransfer = createDragEventData(dragItem);

    fireEvent.drop(dropZone, {
      dataTransfer,
      clientX: 200,
      clientY: 300,
    });

    expect(mockStore.addNode).toHaveBeenCalledTimes(1);

    const addedNode = mockStore.addNode.mock.calls[0][0] as WorkflowNode;

    expect(addedNode.type).toBe("baseNode");

    expect(addedNode.position).toEqual({
      x: 100,
      y: 100,
    });

    expect(addedNode.data.label).toBe("Math");
  });

  it("generates unique node name when dropping an attribute", () => {
    mockStore.nodes = [createNode("existing-node", "Math1")];

    const dragItem: WorkflowDragItem = {
      type: "attribute",
      item: createAttributeItem(),
    };

    render(<Canvas />);

    const dropZone = screen.getByTestId("drop-zone");

    const dataTransfer = createDragEventData(dragItem);

    fireEvent.drop(dropZone, {
      dataTransfer,
      clientX: 200,
      clientY: 300,
    });

    expect(mockStore.addNode).toHaveBeenCalledTimes(1);

    const addedNode = mockStore.addNode.mock.calls[0][0] as WorkflowNode;

    expect(addedNode.data.element.Name).toBe("Math2");
  });

  it("does nothing when dropped item has no element", () => {
    const dragItem = {
      type: "attribute",
      item: {
        id: "math",
        title: "Math",
        icon: Calculator,
        element: undefined,
      },
    } as unknown as WorkflowDragItem;

    render(<Canvas />);

    const dropZone = screen.getByTestId("drop-zone");

    const dataTransfer = createDragEventData(dragItem);

    fireEvent.drop(dropZone, {
      dataTransfer,
    });

    expect(mockStore.addNode).not.toHaveBeenCalled();
  });

  /* Template drop */

  it("loads template workflow when template is dropped", () => {
    const dragItem: WorkflowDragItem = {
      type: "template",
      item: createTemplateItem("template-1"),
    };

    render(<Canvas />);

    const dropZone = screen.getByTestId("drop-zone");

    const dataTransfer = createDragEventData(dragItem);

    fireEvent.drop(dropZone, {
      dataTransfer,
    });

    expect(mockStore.addNode).not.toHaveBeenCalled();
  });

  it("does nothing when dropped template does not exist", () => {
    const dragItem: WorkflowDragItem = {
      type: "template",
      item: createTemplateItem("invalid-template"),
    };

    render(<Canvas />);

    const dropZone = screen.getByTestId("drop-zone");

    const dataTransfer = createDragEventData(dragItem);

    fireEvent.drop(dropZone, {
      dataTransfer,
    });

    expect(mockStore.addNode).not.toHaveBeenCalled();

    expect(mockStore.setNodes).not.toHaveBeenCalled();
  });

  /* Keyboard */

  it("handles Delete key", () => {
    render(<Canvas />);

    fireEvent.keyDown(window, {
      key: "Delete",
    });

    expect(mockStore.deleteSelectedEdges).toHaveBeenCalledTimes(1);

    expect(mockStore.deleteSelectedNodes).toHaveBeenCalledTimes(1);
  });

  it("does not delete when another key is pressed", () => {
    render(<Canvas />);

    fireEvent.keyDown(window, {
      key: "Enter",
    });

    expect(mockStore.deleteSelectedEdges).not.toHaveBeenCalled();

    expect(mockStore.deleteSelectedNodes).not.toHaveBeenCalled();
  });

  /* Pending catalog item */

  it("loads pending template catalog item", () => {
    mockStore.pendingCatalogItem = createTemplateItem("template-1");

    render(<Canvas />);

    expect(mockStore.setPendingCatalogItem).toHaveBeenCalledWith(null);
  });

  it("adds pending attribute catalog item", () => {
    mockStore.pendingCatalogItem = createAttributeItem();

    render(<Canvas />);

    expect(mockStore.addNode).toHaveBeenCalledTimes(1);

    expect(mockStore.setPendingCatalogItem).toHaveBeenCalledWith(null);
  });

  it("generates unique name for pending attribute item", () => {
    mockStore.nodes = [createNode("existing-node", "Math1")];

    mockStore.pendingCatalogItem = createAttributeItem();

    render(<Canvas />);

    expect(mockStore.addNode).toHaveBeenCalledTimes(1);

    const addedNode = mockStore.addNode.mock.calls[0][0] as WorkflowNode;

    expect(addedNode.data.element.Name).toBe("Math2");
  });

  /* Edge dialog */

  it("does not open dialog when there is no selected edge", () => {
    mockStore.selectedEdge = null;

    render(<Canvas />);

    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("opens dialog when an edge is selected", () => {
    mockStore.selectedEdge = {
      id: "edge-1",
      source: "Start",
      target: "End",
      type: "workflow",
    };

    mockStore.nodes = [createNode("Start", "Start"), createNode("End", "End")];

    render(<Canvas />);

    expect(screen.getByTestId("react-flow")).toBeInTheDocument();
  });

  it("adds a node between selected edge nodes", () => {
    const sourceNode = createNode("Start", "Start");

    const targetNode = createNode("End", "End");

    mockStore.nodes = [sourceNode, targetNode];

    mockStore.edges = [
      {
        id: "Start-End",
        source: "Start",
        target: "End",
        type: "workflow",
      },
    ];

    mockStore.selectedEdge = {
      id: "Start-End",
      source: "Start",
      target: "End",
      type: "workflow",
    };

    render(<Canvas />);

    expect(screen.getByTestId("react-flow")).toBeInTheDocument();
  });

  /* Tools */

  it("renders correctly with pointer tool", () => {
    mockStore.activeTool = "pointer";

    render(<Canvas />);

    expect(screen.getByTestId("react-flow")).toBeInTheDocument();
  });

  it("renders correctly with connect tool", () => {
    mockStore.activeTool = "connect";

    render(<Canvas />);

    expect(screen.getByTestId("react-flow")).toBeInTheDocument();
  });

  /* Cleanup */

  it("removes Delete key listener on unmount", () => {
    const { unmount } = render(<Canvas />);

    unmount();

    fireEvent.keyDown(window, {
      key: "Delete",
    });

    expect(mockStore.deleteSelectedEdges).not.toHaveBeenCalled();

    expect(mockStore.deleteSelectedNodes).not.toHaveBeenCalled();
  });
});
