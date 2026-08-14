import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import WorkflowCanvas from "./WorkflowCanvas";

import type { Edge } from "@xyflow/react";

const mockHandleNodeSelection = vi.fn();
const mockLoadMore = vi.fn();

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

vi.mock("../../../../store/templateExecutionStore", () => ({
  useTemplateExecutionStore: vi.fn((selector) =>
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

  return {
    ...actual,

    ConnectionMode: {
      Loose: "Loose",
    },

    BackgroundVariant: {
      Dots: "Dots",
    },

    Background: () => <div data-testid="background" />,

    ReactFlow: ({
      onNodeClick,
      children,
    }: {
      onNodeClick?: (event: unknown, node: unknown) => void;
      children?: React.ReactNode;
    }) => (
      <div data-testid="react-flow">
        <button
          data-testid="normal-node"
          onClick={() => onNodeClick?.({}, mockNodes[0])}
        >
          Normal Node
        </button>

        <button
          data-testid="header-node"
          onClick={() => onNodeClick?.({}, mockNodes[1])}
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

  const renderCanvas = (
    overrides: Partial<{
      executionContext: "unit" | "asset";
      loadMore: () => void;
      hasMore: boolean;
      isLoadingMore: boolean;
    }> = {},
  ) => {
    return render(
      <WorkflowCanvas
        executionContext={overrides.executionContext ?? "unit"}
        loadMore={overrides.loadMore ?? mockLoadMore}
        hasMore={overrides.hasMore ?? true}
        isLoadingMore={overrides.isLoadingMore ?? false}
      />,
    );
  };

  it("renders ReactFlow", () => {
    renderCanvas();

    expect(screen.getByTestId("react-flow")).toBeInTheDocument();
  });

  it("renders ExecutionNodeDrawer", () => {
    renderCanvas();

    expect(screen.getByTestId("node-drawer")).toBeInTheDocument();
  });

  it("renders details panel for asset context", () => {
    renderCanvas({
      executionContext: "asset",
    });

    expect(screen.getByTestId("details-panel")).toBeInTheDocument();
  });

  it("does not render details panel for unit context", () => {
    renderCanvas({
      executionContext: "unit",
    });

    expect(screen.queryByTestId("details-panel")).not.toBeInTheDocument();
  });

  it("renders background", () => {
    renderCanvas();

    expect(screen.getByTestId("background")).toBeInTheDocument();
  });

  it("calls handleNodeSelection for normal node", () => {
    renderCanvas();

    fireEvent.click(screen.getByTestId("normal-node"));

    expect(mockHandleNodeSelection).toHaveBeenCalledWith("node-1", "success");
  });

  it("does not call handleNodeSelection for executionHeader node", () => {
    renderCanvas();

    fireEvent.click(screen.getByTestId("header-node"));

    expect(mockHandleNodeSelection).not.toHaveBeenCalled();
  });

  it("renders with node data present", () => {
    renderCanvas();

    expect(screen.getByTestId("react-flow")).toBeInTheDocument();
  });

  it("uses unit fallback when itemId is undefined", () => {
    mockParams = {
      template: "template-1",
      itemId: undefined,
    };

    renderCanvas({
      executionContext: "unit",
    });

    expect(screen.getByTestId("react-flow")).toBeInTheDocument();
  });

  it("calls loadMore when scrolled near the bottom", () => {
    renderCanvas({
      hasMore: true,
      isLoadingMore: false,
    });

    /*
     * scrollHeight = 1000
     * scrollTop = 600
     * clientHeight = 200
     *
     * distanceFromBottom =
     * 1000 - (600 + 200)
     * = 200
     *
     * SCROLL_THRESHOLD = 300
     *
     * Therefore loadMore() should be called.
     */

    const scrollContainer = screen.getByTestId("react-flow").parentElement;

    expect(scrollContainer).not.toBeNull();

    fireEvent.scroll(scrollContainer!, {
      currentTarget: {
        scrollTop: 600,
        scrollHeight: 1000,
        clientHeight: 200,
      },
    });

    expect(mockLoadMore).toHaveBeenCalledTimes(1);
  });

  it("does not call loadMore when there are no more workflows", () => {
    renderCanvas({
      hasMore: false,
      isLoadingMore: false,
    });

    const scrollContainer = screen.getByTestId("react-flow").parentElement;

    expect(scrollContainer).not.toBeNull();

    fireEvent.scroll(scrollContainer!, {
      currentTarget: {
        scrollTop: 600,
        scrollHeight: 1000,
        clientHeight: 200,
      },
    });

    expect(mockLoadMore).not.toHaveBeenCalled();
  });

  it("does not call loadMore while another request is loading", () => {
    renderCanvas({
      hasMore: true,
      isLoadingMore: true,
    });

    const scrollContainer = screen.getByTestId("react-flow").parentElement;

    expect(scrollContainer).not.toBeNull();

    fireEvent.scroll(scrollContainer!, {
      currentTarget: {
        scrollTop: 600,
        scrollHeight: 1000,
        clientHeight: 200,
      },
    });

    expect(mockLoadMore).not.toHaveBeenCalled();
  });

  it("shows loading indicator while loading more workflows", () => {
    renderCanvas({
      hasMore: true,
      isLoadingMore: true,
    });

    expect(screen.getByText("Loading more rows...")).toBeInTheDocument();
  });

  it("does not show loading indicator when not loading", () => {
    renderCanvas({
      hasMore: true,
      isLoadingMore: false,
    });

    expect(screen.queryByText("Loading more rows...")).not.toBeInTheDocument();
  });
});
