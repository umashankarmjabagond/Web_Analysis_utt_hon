import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import WorkflowCanvas from "./WorkflowCanvas";
import type { Edge, Node } from "@xyflow/react";

const mockNodes: Node[] = [
  {
    id: "row-node-1",
    type: "executionRow",
    position: {
      x: 100,
      y: 100,
    },
    data: {
      itemId: "ROW-101",
    },
  },
  {
    id: "base-node-1",
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

const mockLoadMore = vi.fn();

vi.mock("../../../../store/templateExecutionStore", () => ({
  useTemplateExecutionStore: vi.fn((selector) =>
    selector({
      nodes: mockNodes,
      edges: mockEdges,
    }),
  ),
}));

vi.mock("react-router-dom", () => ({
  useParams: () => mockParams,
}));

vi.mock("@xyflow/react", () => ({
  ConnectionMode: {
    Loose: "loose",
  },
  ReactFlow: ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => (
    <div
      data-testid="react-flow"
      data-node-count={nodes.length}
      data-edge-count={edges.length}
    />
  ),
}));

describe("WorkflowCanvas", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockParams = {
      template: "template-1",
      itemId: "asset-1",
    };
  });

  it("renders ReactFlow with nodes and edges", () => {
    render(
      <WorkflowCanvas
        executionContext="unit"
        loadMore={mockLoadMore}
        hasMore={false}
        isLoadingMore={false}
      />,
    );

    const reactFlow = screen.getByTestId("react-flow");

    expect(reactFlow).toBeInTheDocument();
    expect(reactFlow).toHaveAttribute("data-node-count", "3");
    expect(reactFlow).toHaveAttribute("data-edge-count", "0");
  });

  it("calls loadMore when scrolling near the bottom", () => {
    const loadMore = vi.fn();
    render(
      <WorkflowCanvas
        executionContext="unit"
        loadMore={loadMore}
        hasMore={true}
        isLoadingMore={false}
      />,
    );

    const scrollContainer =
      screen.getByTestId("react-flow").parentElement?.parentElement;

    expect(scrollContainer).toBeTruthy();

    Object.defineProperties(scrollContainer!, {
      scrollTop: {
        value: 700,
        configurable: true,
      },
      scrollHeight: {
        value: 1000,
        configurable: true,
      },
      clientHeight: {
        value: 400,
        configurable: true,
      },
    });

    fireEvent.scroll(scrollContainer!);

    expect(loadMore).toHaveBeenCalledTimes(1);
  });

  it("does not call loadMore when there are no more rows", () => {
    const loadMore = vi.fn();

    render(
      <WorkflowCanvas
        executionContext="asset"
        loadMore={loadMore}
        hasMore={false}
        isLoadingMore={false}
      />,
    );

    const scrollContainer =
      screen.getByTestId("react-flow").parentElement?.parentElement;

    Object.defineProperties(scrollContainer!, {
      scrollTop: {
        value: 700,
        configurable: true,
      },
      scrollHeight: {
        value: 1000,
        configurable: true,
      },
      clientHeight: {
        value: 400,
        configurable: true,
      },
    });

    fireEvent.scroll(scrollContainer!);

    expect(loadMore).not.toHaveBeenCalled();
  });

  it("does not call loadMore while already loading", () => {
    const loadMore = vi.fn();

    render(
      <WorkflowCanvas
        executionContext="asset"
        loadMore={loadMore}
        hasMore={true}
        isLoadingMore={true}
      />,
    );

    const scrollContainer =
      screen.getByTestId("react-flow").parentElement?.parentElement;

    Object.defineProperties(scrollContainer!, {
      scrollTop: {
        value: 700,
        configurable: true,
      },
      scrollHeight: {
        value: 1000,
        configurable: true,
      },
      clientHeight: {
        value: 400,
        configurable: true,
      },
    });

    fireEvent.scroll(scrollContainer!);

    expect(loadMore).not.toHaveBeenCalled();
  });

  it("renders loading indicator when loading more rows", () => {
    render(
      <WorkflowCanvas
        executionContext="asset"
        loadMore={vi.fn()}
        hasMore={true}
        isLoadingMore={true}
      />,
    );

    expect(screen.getByText("Loading more rows...")).toBeInTheDocument();
  });

  it("does not render loading indicator when not loading", () => {
    render(
      <WorkflowCanvas
        executionContext="asset"
        loadMore={vi.fn()}
        hasMore={true}
        isLoadingMore={false}
      />,
    );

    expect(screen.queryByText("Loading more rows...")).not.toBeInTheDocument();
  });
});
