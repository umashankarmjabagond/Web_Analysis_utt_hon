import React from "react";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  render,
  screen,
  fireEvent,
  act,
} from "@testing-library/react";

import Canvas from "./Canvas";

type ReactFlowProps = {
  onDrop?: (
    event: unknown,
  ) => void;

  onDragOver?: (
    event: unknown,
  ) => void;

  onNodeClick?: (
    event: unknown,
    node: unknown,
  ) => void;

  onPaneClick?: () => void;

  onNodeDragStart?: () => void;

  edges?: Array<{
    data?: {
      onEdgeInsert?: (
        edge: unknown,
      ) => void;
    };
  }>;

  children?: React.ReactNode;
};

let reactFlowProps:
  ReactFlowProps;

const screenToFlowPosition =
  vi.fn(() => ({
    x: 100,
    y: 200,
  }));

vi.mock("@xyflow/react", () => ({
  MarkerType: {
    ArrowClosed:
      "ArrowClosed",
  },

  BackgroundVariant: {
    Dots: "Dots",
  },

  ReactFlow: (
    props: ReactFlowProps,
  ) => {
    reactFlowProps = props;

    return (
      <div data-testid="react-flow">
        {props.children}
      </div>
    );
  },

  Background: () => (
    <div data-testid="background" />
  ),

  useReactFlow: () => ({
    screenToFlowPosition,
  }),
}));

vi.mock(
  "./toolbar/Toolbar",
  () => ({
    default: () => (
      <div data-testid="toolbar">
        Toolbar
      </div>
    ),
  }),
);

vi.mock(
  "../../../components/common/dialogue/Dialog",
  () => ({
    default: ({
      title,
      subtitle,
      children,
      onClose,
    }: {
      title: string;
      subtitle: string;
      children: React.ReactNode;
      onClose: () => void;
    }) => (
      <div data-testid="dialog">
        <span>{title}</span>

        <span>{subtitle}</span>

        <button
          data-testid="close-dialog"
          onClick={onClose}
        >
          Close
        </button>

        {children}
      </div>
    ),
  }),
);

const mockWorkflowItem = {
  id: "attribute-1",
  title: "Temperature",
  element: {
    Name: "",
    elementType: "Attribute",
  },
};

vi.mock(
  "../../../components/forms/select/GroupedSelector",
  () => ({
    default: ({
      onSelect,
    }: {
      onSelect: (
        item: {
          value: unknown;
        },
      ) => void;
    }) => (
      <button
        data-testid="grouped-selector"
        onClick={() =>
          onSelect({
            value:
              mockWorkflowItem,
          })
        }
      >
        Select Item
      </button>
    ),
  }),
);

vi.mock(
  "../../../utils/utils",
  () => ({
    backendToFlow: vi.fn(() => ({
      nodes: [
        {
          id: "node-1",
          type: "baseNode",
          position: {
            x: 100,
            y: 100,
          },
          data: {},
        },
      ],
      edges: [
        {
          id: "edge-1",
          source: "node-a",
          target: "node-b",
        },
      ],
    })),
  }),
);

vi.mock(
  "../workflowPanelData ",
  () => ({
    attributeCatalogSections: [
      {
        id: undefined,
        title: "Attributes",
        items: [
          {
            id: "attribute-1",
            title: "Temperature",
            element: {
              Name: "",
              elementType: "Attribute",
            },
          },
        ],
      },
    ],

    dummyWorkflows: {
      template1: {
        id: "template1",
      },
    },
  }),
);

const addNode = vi.fn();
const setNodes = vi.fn();
const setEdges = vi.fn();

const deleteSelectedNodes =
  vi.fn();

const deleteSelectedEdges =
  vi.fn();

const setSelectedNode =
  vi.fn();

const setSelectedEdge = vi.fn(
  (edge) => {
    storeState.selectedEdge = edge;
  },
);

const saveHistory = vi.fn();

const clearWorkflow =
  vi.fn();

const setPendingCatalogItem =
  vi.fn();

let storeState: {
  nodes: unknown[];
  edges: unknown[];
  [key: string]: unknown;
};

vi.mock(
  "../../../store/workflowStore",
  () => ({
    useWorkflowStore:
      () => storeState,
  }),
);

beforeEach(() => {
  vi.clearAllMocks();

  storeState = {
    nodes: [],
    edges: [],

    addNode,
    setNodes,
    setEdges,

    onNodesChange:
      vi.fn(),

    onEdgesChange:
      vi.fn(),

    onConnect:
      vi.fn(),

    deleteSelectedNodes,
    deleteSelectedEdges,

    setSelectedNode,
    setSelectedEdge,

    selectedEdge:
      null,

    activeTool:
      "pointer",

    saveHistory,

    clearWorkflow,

    pendingCatalogItem:
      null,

    setPendingCatalogItem,
  };
});


describe("Canvas", () => {
  it("calls clearWorkflow on mount", () => {
    render(<Canvas />);

    expect(
      clearWorkflow,
    ).toHaveBeenCalled();
  });

  it("renders empty state", () => {
  render(<Canvas />);

  expect(
    screen.getByText(
      "Create New Template",
    ),
  ).toBeInTheDocument();
});

it("handles drag over", () => {
  render(<Canvas />);

  const event = {
    preventDefault: vi.fn(),
    dataTransfer: {
      dropEffect: "",
    },
  };

  reactFlowProps.onDragOver?.(
    event,
  );

  expect(
    event.preventDefault,
  ).toHaveBeenCalled();

  expect(
    event.dataTransfer.dropEffect,
  ).toBe("move");
});

it("handles node click", () => {
  render(<Canvas />);

  const node = {
    id: "node-1",
  };

  reactFlowProps.onNodeClick?.(
    {},
    node,
  );

  expect(
    setSelectedNode,
  ).toHaveBeenCalledWith(
    node,
  );
});

it("handles pane click", () => {
  render(<Canvas />);

  reactFlowProps.onPaneClick?.();

  expect(
    setSelectedNode,
  ).toHaveBeenCalledWith(
    null,
  );
});

it("deletes selected items on Delete key", () => {
  render(<Canvas />);

  fireEvent.keyDown(
    window,
    {
      key: "Delete",
    },
  );

  expect(
    deleteSelectedEdges,
  ).toHaveBeenCalled();

  expect(
    deleteSelectedNodes,
  ).toHaveBeenCalled();
});

it("saves history on node drag", () => {
  render(<Canvas />);

  reactFlowProps.onNodeDragStart?.();

  expect(
    saveHistory,
  ).toHaveBeenCalled();
});

it("loads template from pending catalog item", () => {
  storeState.pendingCatalogItem = {
    id: "template1",
    title: "Template",
    element: {
      elementType: "Template",
    },
  };

  render(<Canvas />);

  expect(setNodes)
    .toHaveBeenCalled();

  expect(setEdges)
    .toHaveBeenCalled();

  expect(
    setPendingCatalogItem,
  ).toHaveBeenCalledWith(
    null,
  );
});

it("creates node from pending attribute item", () => {
  storeState.pendingCatalogItem = {
    id: "attribute-1",

    title: "Temperature",

    element: {
      Name: "",
      elementType:
        "Attribute",
    },
  };

  render(<Canvas />);

  expect(addNode)
    .toHaveBeenCalled();

  expect(
    setPendingCatalogItem,
  ).toHaveBeenCalledWith(
    null,
  );
});

it("ignores empty drop payload", () => {
  render(<Canvas />);

  reactFlowProps.onDrop?.({
    preventDefault:
      vi.fn(),

    dataTransfer: {
      getData: () => "",
    },
  });

  expect(addNode)
    .not.toHaveBeenCalled();
});

it("loads template on drop", () => {
  render(<Canvas />);

  reactFlowProps.onDrop?.({
    preventDefault:
      vi.fn(),

    dataTransfer: {
      getData: () =>
        JSON.stringify({
          type:
            "template",

          item: {
            id:
              "template1",
          },
        }),
    },
  });

  expect(setNodes)
    .toHaveBeenCalled();

  expect(setEdges)
    .toHaveBeenCalled();
});

it("adds attribute when dropped", () => {
  render(<Canvas />);

  reactFlowProps.onDrop?.({
    preventDefault:
      vi.fn(),

    clientX: 25,
    clientY: 50,

    dataTransfer: {
      getData: () =>
        JSON.stringify({
          type:
            "attribute",

          item: {
            title:
              "Temperature",

            element: {
              Name: "",

              elementType:
                "Attribute",
            },
          },
        }),
    },
  });

  expect(addNode)
    .toHaveBeenCalled();

  expect(
    screenToFlowPosition,
  ).toHaveBeenCalled();
});

it("opens dialog when edge insert is triggered", () => {
  storeState.edges = [
    {
      id: "edge-1",
      source: "source",
      target: "target",
    },
  ];

  render(<Canvas />);

  act(() => {
    reactFlowProps.edges?.[0]
      ?.data?.onEdgeInsert?.({
        id: "edge-1",
        source: "source",
        target: "target",
      });
  });

  expect(
    setSelectedEdge,
  ).toHaveBeenCalledWith({
    id: "edge-1",
    source: "source",
    target: "target",
  });
});

it("generates unique attribute name", () => {
  storeState.pendingCatalogItem = {
    id: "attribute-1",
    title: "Temperature",
    element: {
      Name: "",
      elementType: "Attribute",
    },
  };

  storeState.nodes = [
    {
      id: "Attribute1",
      position: {
        x: 0,
        y: 0,
      },
      data: {
        element: {
          Name: "Attribute1",
        },
      },
    },
  ];

  render(<Canvas />);

  expect(addNode).toHaveBeenCalled();

  const addedNode =
    addNode.mock.calls[0][0];

  expect(
    addedNode.data.element.Name,
  ).toBe("Attribute2");
});

it("covers handleAddNewNode", () => {
  storeState.selectedEdge = {
    id: "edge-1",
    source: "source",
    target: "target",
  };

  storeState.nodes = [
    {
      id: "source",
      position: {
        x: 0,
        y: 0,
      },
      data: {
        element: {
          Name: "A",
        },
      },
    },
    {
      id: "target",
      position: {
        x: 200,
        y: 200,
      },
      data: {
        element: {
          Name: "B",
        },
      },
    },
  ];

  storeState.edges = [
    {
      id: "edge-1",
      source: "source",
      target: "target",
    },
  ];

  render(<Canvas />);

  fireEvent.click(
    screen.getByTestId(
      "grouped-selector",
    ),
  );

  expect(saveHistory)
    .toHaveBeenCalled();

  expect(setNodes)
    .toHaveBeenCalled();

  expect(setEdges)
    .toHaveBeenCalled();

  expect(
    setSelectedEdge,
  ).toHaveBeenCalledWith(
    null,
  );
});

it("closes dialog", () => {
  render(<Canvas />);

  fireEvent.click(
    screen.getByTestId(
      "close-dialog",
    ),
  );

  expect(
    setSelectedEdge,
  ).toHaveBeenCalledWith(
    null,
  );
});

it("returns when dropped attribute has no element", () => {
  render(<Canvas />);

  reactFlowProps.onDrop?.({
    preventDefault: vi.fn(),
    clientX: 0,
    clientY: 0,
    dataTransfer: {
      getData: () =>
        JSON.stringify({
          type: "attribute",
          item: {},
        }),
    },
  });

  expect(addNode)
    .not.toHaveBeenCalled();
});

it("ignores unknown template drop", () => {
  render(<Canvas />);

  reactFlowProps.onDrop?.({
    preventDefault: vi.fn(),
    dataTransfer: {
      getData: () =>
        JSON.stringify({
          type: "template",
          item: {
            id: "unknown-template",
          },
        }),
    },
  });

  expect(setNodes)
    .not.toHaveBeenCalled();

  expect(setEdges)
    .not.toHaveBeenCalled();
});





it("handles unknown pending template item", () => {
  storeState.pendingCatalogItem = {
    id: "unknown-template",
    title: "Unknown Template",
    element: {
      elementType: "Template",
    },
  };

  render(<Canvas />);

  expect(setNodes)
    .not.toHaveBeenCalled();

  expect(setEdges)
    .not.toHaveBeenCalled();

  expect(
    setPendingCatalogItem,
  ).toHaveBeenCalledWith(
    null,
  );
});

it("returns when selected item has no element", () => {
  storeState.selectedEdge = {
    id: "edge-1",
    source: "source",
    target: "target",
  };

  render(<Canvas />);

  const originalItem = mockWorkflowItem.element;

  mockWorkflowItem.element = undefined as never;

  fireEvent.click(
    screen.getByTestId(
      "grouped-selector",
    ),
  );

  expect(saveHistory)
    .not.toHaveBeenCalled();

  mockWorkflowItem.element =
    originalItem;
});

it("returns when selectedEdge is null", () => {
  storeState.selectedEdge = null;

  render(<Canvas />);

  fireEvent.click(
    screen.getByTestId(
      "grouped-selector",
    ),
  );

  expect(saveHistory)
    .not.toHaveBeenCalled();
});

it("returns when source or target node is missing", () => {
  storeState.selectedEdge = {
    id: "edge-1",
    source: "missing-source",
    target: "missing-target",
  };

  storeState.nodes = [];

  render(<Canvas />);

  fireEvent.click(
    screen.getByTestId(
      "grouped-selector",
    ),
  );

  expect(saveHistory)
    .toHaveBeenCalled();

  expect(setNodes)
    .not.toHaveBeenCalled();

  expect(setEdges)
    .not.toHaveBeenCalled();
});

it("does not delete items for non Delete key", () => {
  render(<Canvas />);

  fireEvent.keyDown(window, {
    key: "Enter",
  });

  expect(
    deleteSelectedEdges,
  ).not.toHaveBeenCalled();

  expect(
    deleteSelectedNodes,
  ).not.toHaveBeenCalled();
});

});