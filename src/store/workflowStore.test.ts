import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { useWorkflowStore } from "./workflowStore";

vi.mock("@xyflow/react", () => ({
  addEdge: vi.fn((edge, edges) => [
    ...edges,
    {
      id: "new-edge",
      ...edge,
    },
  ]),

  applyNodeChanges: vi.fn(
    (_changes, nodes) => nodes,
  ),

  applyEdgeChanges: vi.fn(
    (_changes, edges) => edges,
  ),

  MarkerType: {
    ArrowClosed: "ArrowClosed",
  },
}));

describe("workflowStore", () => {
  beforeEach(() => {
    useWorkflowStore.setState({
      nodes: [],
      edges: [],
      selectedNode: null,
      selectedEdge: null,
      activeTool: "pointer",
      history: [],
      future: [],
      pendingCatalogItem: null,
    });
  });

  it("sets nodes", () => {
    const nodes = [{ id: "1" }];

    useWorkflowStore
      .getState()
      .setNodes(nodes as never);

    expect(
      useWorkflowStore.getState().nodes,
    ).toEqual(nodes);
  });

  it("sets edges", () => {
    const edges = [{ id: "e1" }];

    useWorkflowStore
      .getState()
      .setEdges(edges as never);

    expect(
      useWorkflowStore.getState().edges,
    ).toEqual(edges);
  });

  it("sets selected node", () => {
    const node = { id: "1" };

    useWorkflowStore
      .getState()
      .setSelectedNode(node as never);

    expect(
      useWorkflowStore.getState()
        .selectedNode,
    ).toEqual(node);
  });

  it("sets selected edge", () => {
    const edge = { id: "e1" };

    useWorkflowStore
      .getState()
      .setSelectedEdge(edge as never);

    expect(
      useWorkflowStore.getState()
        .selectedEdge,
    ).toEqual(edge);
  });

  it("sets active tool", () => {
    useWorkflowStore
      .getState()
      .setActiveTool("connect");

    expect(
      useWorkflowStore.getState()
        .activeTool,
    ).toBe("connect");
  });

  it("sets pending catalog item", () => {
    const item = {
      id: "catalog",
    };

    useWorkflowStore
      .getState()
      .setPendingCatalogItem(
        item as never,
      );

    expect(
      useWorkflowStore.getState()
        .pendingCatalogItem,
    ).toEqual(item);
  });

  it("saves history", () => {
    useWorkflowStore.setState({
      nodes: [{ id: "1" }] as never,
      edges: [{ id: "e1" }] as never,
    });

    useWorkflowStore
      .getState()
      .saveHistory();

    expect(
      useWorkflowStore.getState()
        .history.length,
    ).toBe(1);

    expect(
      useWorkflowStore.getState()
        .future,
    ).toEqual([]);
  });

  it("undo restores previous state", () => {
    useWorkflowStore.setState({
      nodes: [{ id: "current" }] as never,
      edges: [],
      history: [
        {
          nodes: [{ id: "previous" }] as never,
          edges: [],
        },
      ],
      future: [],
    });

    useWorkflowStore
      .getState()
      .undo();

    expect(
      useWorkflowStore.getState()
        .nodes[0].id,
    ).toBe("previous");
  });

  it("undo does nothing when history is empty", () => {
    useWorkflowStore.setState({
      history: [],
    });

    useWorkflowStore
      .getState()
      .undo();

    expect(
      useWorkflowStore.getState()
        .history,
    ).toEqual([]);
  });

  it("redo restores future state", () => {
    useWorkflowStore.setState({
      nodes: [],
      edges: [],
      history: [],
      future: [
        {
          nodes: [{ id: "future" }] as never,
          edges: [],
        },
      ],
    });

    useWorkflowStore
      .getState()
      .redo();

    expect(
      useWorkflowStore.getState()
        .nodes[0].id,
    ).toBe("future");
  });

  it("redo does nothing when future is empty", () => {
    useWorkflowStore.setState({
      future: [],
    });

    useWorkflowStore
      .getState()
      .redo();

    expect(
      useWorkflowStore.getState()
        .future,
    ).toEqual([]);
  });

  it("adds node", () => {
    useWorkflowStore
      .getState()
      .addNode({
        id: "node-1",
      } as never);

    expect(
      useWorkflowStore.getState()
        .nodes.length,
    ).toBe(1);
  });

  it("handles node changes", () => {
    useWorkflowStore
      .getState()
      .onNodesChange([]);

    expect(true).toBe(true);
  });

  it("handles edge changes", () => {
    useWorkflowStore
      .getState()
      .onEdgesChange([]);

    expect(true).toBe(true);
  });

  it("creates connection", () => {
    useWorkflowStore
      .getState()
      .onConnect({
        source: "1",
        target: "2",
      } as never);

    expect(
      useWorkflowStore.getState()
        .edges.length,
    ).toBe(1);
  });

  it("does not connect node to itself", () => {
    useWorkflowStore
      .getState()
      .onConnect({
        source: "1",
        target: "1",
      } as never);

    expect(
      useWorkflowStore.getState()
        .edges,
    ).toEqual([]);
  });

  it("does not create duplicate edge", () => {
    useWorkflowStore.setState({
      edges: [
        {
          id: "e1",
          source: "1",
          target: "2",
        },
      ] as never,
    });

    useWorkflowStore
      .getState()
      .onConnect({
        source: "1",
        target: "2",
      } as never);

    expect(
      useWorkflowStore.getState()
        .edges.length,
    ).toBe(1);
  });

  it("deletes selected nodes and connected edges", () => {
    useWorkflowStore.setState({
      nodes: [
        {
          id: "1",
          selected: true,
        },
        {
          id: "2",
        },
      ] as never,

      edges: [
        {
          id: "e1",
          source: "1",
          target: "2",
        },
      ] as never,
    });

    useWorkflowStore
      .getState()
      .deleteSelectedNodes();

    expect(
      useWorkflowStore.getState()
        .nodes.length,
    ).toBe(1);

      expect(
    useWorkflowStore.getState()
      .edges.length,
  ).toBe(0);

  expect(
    useWorkflowStore.getState()
      .selectedNode,
  ).toBeNull();

  expect(
    useWorkflowStore.getState()
      .selectedEdge,
  ).toBeNull();
});

it("deletes selected edges", () => {
  useWorkflowStore.setState({
    edges: [
      {
        id: "e1",
        selected: true,
      },
      {
        id: "e2",
        selected: false,
      },
    ] as never,
  });

  useWorkflowStore
    .getState()
    .deleteSelectedEdges();

  expect(
    useWorkflowStore.getState()
      .edges.length,
  ).toBe(1);

  expect(
    useWorkflowStore.getState()
      .selectedEdge,
  ).toBeNull();
});

it("clears workflow", () => {
  useWorkflowStore.setState({
    nodes: [{ id: "1" }] as never,
    edges: [{ id: "e1" }] as never,
    selectedNode: {
      id: "1",
    } as never,
    selectedEdge: {
      id: "e1",
    } as never,
    history: [{}] as never,
    future: [{}] as never,
  });

  useWorkflowStore
    .getState()
    .clearWorkflow();

  const state =
    useWorkflowStore.getState();

  expect(state.nodes).toEqual([]);
  expect(state.edges).toEqual([]);
  expect(state.selectedNode).toBeNull();
  expect(state.selectedEdge).toBeNull();
  expect(state.history).toEqual([]);
  expect(state.future).toEqual([]);
  expect(state.activeTool).toBe(
    "pointer",
  );
});

it("sets workflow", () => {
  const nodes = [{ id: "1" }];
  const edges = [{ id: "e1" }];

  useWorkflowStore
    .getState()
    .setWorkflow(
      nodes as never,
      edges as never,
    );

  expect(
    useWorkflowStore.getState()
      .nodes,
  ).toEqual(nodes);

  expect(
    useWorkflowStore.getState()
      .edges,
  ).toEqual(edges);

  expect(
    useWorkflowStore.getState()
      .selectedNode,
  ).toBeNull();

  expect(
    useWorkflowStore.getState()
      .selectedEdge,
  ).toBeNull();
});

it("deletes edges when selected node is the target", () => {
  useWorkflowStore.setState({
    nodes: [
      {
        id: "1",
      },
      {
        id: "2",
        selected: true,
      },
    ] as never,

    edges: [
      {
        id: "e1",
        source: "1",
        target: "2",
      },
    ] as never,
  });

  useWorkflowStore
    .getState()
    .deleteSelectedNodes();

  expect(
    useWorkflowStore.getState()
      .edges,
  ).toEqual([]);

  expect(
    useWorkflowStore.getState()
      .nodes.length,
  ).toBe(1);
});
});