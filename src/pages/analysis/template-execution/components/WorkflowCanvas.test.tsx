import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import WorkflowCanvas from "./WorkflowCanvas";

import type { Edge } from "@xyflow/react";

const mockHandleNodeSelection = vi.fn();

const mockNodes = [
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

vi.mock("react-router-dom", () => ({
  useParams: () => mockParams,
}));


vi.mock(
  "../../../../store/templateExecutionStore",
  () => ({
    useTemplateExecutionStore: vi.fn(
      (selector) =>
        selector({
          nodes: mockNodes,
          edges: mockEdges,
        }),
    ),
  }),
);

vi.mock(
  "../../../../hooks/useWorkflowInteractions",
  () => ({
    useWorkflowCanvasInteractions:
      () => ({
        handleNodeSelection:
          mockHandleNodeSelection,
      }),
  }),
);

vi.mock(
  "./ExecutionNodeDrawer",
  () => ({
    default: () => (
      <div data-testid="node-drawer">
        Node Drawer
      </div>
    ),
  }),
);

vi.mock(
  "./ExecutionDetailsPanel",
  () => ({
    default: () => (
      <div data-testid="details-panel">
        Details Panel
      </div>
    ),
  }),
);

vi.mock(
  "@xyflow/react",
  async () => {
    const actual =
      await vi.importActual(
        "@xyflow/react",
      );

    return {
      ...actual,

      ConnectionMode: {
        Loose: "Loose",
      },

      BackgroundVariant: {
        Dots: "Dots",
      },

      Background: () => (
        <div data-testid="background" />
      ),

      ReactFlow: ({
        onNodeClick,
        children,
      }: any) => (
        <div data-testid="react-flow">
          <button
            data-testid="normal-node"
            onClick={() =>
              onNodeClick?.({}, mockNodes[0])
            }
          >
            Normal Node
          </button>

          <button
            data-testid="header-node"
            onClick={() =>
              onNodeClick?.({}, mockNodes[1])
            }
          >
            Header Node
          </button>

          {children}
        </div>
      ),
    };
  },
);

describe("WorkflowCanvas", () => {
  beforeEach(() => {
  vi.clearAllMocks();

  mockParams = {
    template: "template-1",
    itemId: "asset-1",
  };
});

  it("renders ReactFlow", () => {
    render(
      <WorkflowCanvas
        executionContext="unit"
      />,
    );

    expect(
      screen.getByTestId(
        "react-flow",
      ),
    ).toBeInTheDocument();
  });

  it("renders ExecutionNodeDrawer", () => {
    render(
      <WorkflowCanvas
        executionContext="unit"
      />,
    );

    expect(
      screen.getByTestId(
        "node-drawer",
      ),
    ).toBeInTheDocument();
  });

  it("renders details panel for asset context", () => {
    render(
      <WorkflowCanvas
        executionContext="asset"
      />,
    );

    expect(
      screen.getByTestId(
        "details-panel",
      ),
    ).toBeInTheDocument();
  });

  it("does not render details panel for unit context", () => {
    render(
      <WorkflowCanvas
        executionContext="unit"
      />,
    );

    expect(
      screen.queryByTestId(
        "details-panel",
      ),
    ).not.toBeInTheDocument();
  });

  it("renders background", () => {
    render(
      <WorkflowCanvas
        executionContext="unit"
      />,
    );

    expect(
      screen.getByTestId(
        "background",
      ),
    ).toBeInTheDocument();
  });

  it("calls handleNodeSelection for normal node", () => {
    render(
      <WorkflowCanvas
        executionContext="unit"
      />,
    );

    fireEvent.click(
      screen.getByTestId(
        "normal-node",
      ),
    );

    expect(
      mockHandleNodeSelection,
    ).toHaveBeenCalledWith(
      "node-1",
      "success",
    );
  });

  it("does not call handleNodeSelection for executionHeader node", () => {
    render(
      <WorkflowCanvas
        executionContext="unit"
      />,
    );

    fireEvent.click(
      screen.getByTestId(
        "header-node",
      ),
    );

    expect(
      mockHandleNodeSelection,
    ).not.toHaveBeenCalled();
  });

  it("renders with node data present", () => {
    render(
      <WorkflowCanvas
        executionContext="unit"
      />,
    );

    expect(
      screen.getByTestId(
        "react-flow",
      ),
    ).toBeInTheDocument();
  });

  it("uses unit fallback when itemId is undefined", () => {
  mockParams = {
    template: "template-1",
    itemId: undefined,
  };

  render(
    <WorkflowCanvas
      executionContext="unit"
    />,
  );

  expect(
    screen.getByTestId(
      "react-flow",
    ),
  ).toBeInTheDocument();
});

});