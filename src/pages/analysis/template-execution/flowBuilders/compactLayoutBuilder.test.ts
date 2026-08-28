import { describe, it, expect } from "vitest";
import {
  assignSkipEdgeLanes,
  buildCompactTemplateItemFlow,
  getNodeWidth,
  layoutSequenceAsLine,
  normalizeVerticalPosition,
  reassignEdgeHandles,
} from "./compactLayoutBuilder";
import type {
  ExecutionFlowNode,
  WorkflowData,
} from "../../../../types/templateExecution";
import {
  COMPACT_LAYOUT,
  HEADERNODE_LAYOUT,
  ROW_LAYOUT,
  SKIP_EDGE_LAYOUT,
} from "./layoutConstants";
import type { WorkflowEdge } from "../../../../types/workFlowTypes";

const createNode = (id: string, x = 0, y = 0): ExecutionFlowNode => ({
  id,
  type: "base",
  position: { x, y },
  data: {
    label: id,
    status: "success",
  },
});

const mockGetBBox = () => {
  const mockBBox = {
    x: 0,
    y: 0,
    width: 100,
    height: 30,
  };

  const originalCreateElementNS = document.createElementNS;

  vi.spyOn(document, "createElementNS").mockImplementation(
    (namespace, qualifiedName) => {
      const element = originalCreateElementNS.call(
        document,
        namespace,
        qualifiedName,
      );

      if (qualifiedName === "path") {
        const pathElement = element as SVGPathElement;
        pathElement.getBBox = () => mockBBox as DOMRect;
      }

      return element;
    },
  );
};

afterEach(() => {
  vi.resetAllMocks();
});

describe("layoutSequenceAsLine", () => {
  const START_X = ROW_LAYOUT.leftPadding;
  const START_Y = ROW_LAYOUT.topPadding;

  it("positions nodes from left to right in sequence order", () => {
    const sequence = ["A", "B", "C"];
    const nodesById = new Map<string, ExecutionFlowNode>([
      ["A", createNode("A", 0, 0)],
      ["B", createNode("B", 100, 100)],
      ["C", createNode("C", 200, 200)],
    ]);

    const result = layoutSequenceAsLine(sequence, nodesById, START_X, START_Y);

    expect(result[0].position).toEqual({ x: 50, y: 24 });
    expect(result[1].position).toEqual({ x: 122, y: 24 });
    expect(result[2].position).toEqual({ x: 194, y: 24 });
  });

  it("positions nodes according to the sequence order", () => {
    const sequence = ["C", "A", "B"];

    const nodesById = new Map<string, ExecutionFlowNode>([
      ["A", createNode("A")],
      ["B", createNode("B")],
      ["C", createNode("C")],
    ]);

    const result = layoutSequenceAsLine(sequence, nodesById, START_X, START_Y);

    expect(result.map((node) => node.id)).toEqual(["C", "A", "B"]);

    expect(result[0].position).toEqual({ x: 50, y: 24 });
    expect(result[1].position).toEqual({ x: 122, y: 24 });
    expect(result[2].position).toEqual({ x: 194, y: 24 });
  });

  it("places all nodes at the provided y position", () => {
    const sequence = ["A", "B", "C"];
    const Y = 100;

    const nodesById = new Map<string, ExecutionFlowNode>([
      ["A", createNode("A", 0, 20)],
      ["B", createNode("B", 100, 200)],
      ["C", createNode("C", 200, 300)],
    ]);

    const result = layoutSequenceAsLine(sequence, nodesById, START_X, Y);

    expect(result.every((node) => node.position.y === Y)).toBe(true);
  });

  it("preserves the original node properties", () => {
    const sequence = ["A"];
    const node = createNode("A", 100, 200);

    const nodesById = new Map<string, ExecutionFlowNode>([["A", node]]);

    const result = layoutSequenceAsLine(sequence, nodesById, START_X, START_Y);

    expect(result[0]).toMatchObject({
      id: "A",
      type: node.type,
      data: node.data,
      position: {
        x: 50,
        y: 24,
      },
    });
  });

  it("positions each node after the previous node width and horizontal gap", () => {
    const sequence = ["A", "B"];

    const nodesById = new Map<string, ExecutionFlowNode>([
      ["A", createNode("A")],
      ["B", createNode("B")],
    ]);

    const result = layoutSequenceAsLine(sequence, nodesById, START_X, START_Y);

    const expectedNextX =
      START_X +
      getNodeWidth(nodesById.get("A")!) +
      COMPACT_LAYOUT.horizontalGap;

    expect(result[0].position.x).toBe(START_X);
    expect(result[1].position.x).toBe(expectedNextX);
  });
});

describe("assignSkipEdgeLanes", () => {
  it("assigns the first skip edge to lane 0", () => {
    const spans = [
      {
        edgeIndex: 0,
        start: 1,
        end: 3,
      },
    ];

    const result = assignSkipEdgeLanes(spans);

    expect(result.get(0)).toBe(0);
  });

  it("assigns overlapping skip edges to different lanes", () => {
    const spans = [
      { edgeIndex: 0, start: 1, end: 4 },
      { edgeIndex: 1, start: 2, end: 5 },
    ];

    const result = assignSkipEdgeLanes(spans);

    expect(result.get(0)).toBe(0);
    expect(result.get(1)).toBe(1);
  });

  it("reuses a lane when skip edges do not overlap", () => {
    const spans = [
      { edgeIndex: 0, start: 1, end: 3 },
      { edgeIndex: 1, start: 4, end: 6 },
    ];

    const result = assignSkipEdgeLanes(spans);

    expect(result.get(0)).toBe(0);
    expect(result.get(1)).toBe(0);
  });
});

describe("reassignEdgeHandles", () => {
  it("assigns right-to-left handles to adjacent edges", () => {
    const sequence = ["A", "B", "C"];

    const edges: WorkflowEdge[] = [
      {
        id: "A-B",
        source: "A",
        target: "B",
      },
    ];

    const result = reassignEdgeHandles(edges, sequence);

    expect(result[0]).toMatchObject({
      sourceHandle: "right",
      targetHandle: "left",
    });
  });

  it("assigns top-to-top handles and an offset to skip edges", () => {
    const sequence = ["A", "B", "C"];

    const edges: WorkflowEdge[] = [
      {
        id: "A-C",
        source: "A",
        target: "C",
      },
    ];

    const result = reassignEdgeHandles(edges, sequence);

    expect(result[0]).toMatchObject({
      sourceHandle: "top",
      targetHandle: "top",
      data: {
        pathType: "smoothstep",
        offset: SKIP_EDGE_LAYOUT.baseOffset,
      },
    });
  });

  it("assigns different offsets to overlapping skip edges", () => {
    const sequence = ["A", "B", "C", "D"];

    const edges: WorkflowEdge[] = [
      {
        id: "A-C",
        source: "A",
        target: "C",
      },
      {
        id: "B-D",
        source: "B",
        target: "D",
      },
    ];

    const result = reassignEdgeHandles(edges, sequence);

    expect(result[0].data?.offset).toBe(SKIP_EDGE_LAYOUT.baseOffset);
    expect(result[1].data?.offset).toBe(
      SKIP_EDGE_LAYOUT.baseOffset + SKIP_EDGE_LAYOUT.laneSpacing,
    );
  });

  it("reuses the same offset for non-overlapping skip edges", () => {
    const sequence = ["A", "B", "C", "D", "E", "F"];

    const edges: WorkflowEdge[] = [
      {
        id: "A-C",
        source: "A",
        target: "C",
      },
      {
        id: "D-F",
        source: "D",
        target: "F",
      },
    ];

    const result = reassignEdgeHandles(edges, sequence);

    expect(result[0].data?.offset).toBe(SKIP_EDGE_LAYOUT.baseOffset);
    expect(result[1].data?.offset).toBe(SKIP_EDGE_LAYOUT.baseOffset);
  });
});

describe("normalizeVerticalPosition", () => {
  it("shifts nodes down when the calculated bounds start above the target position", () => {
    mockGetBBox();

    const lineNodes = [createNode("A", 50, 0), createNode("B", 122, 0)];
    const edges: WorkflowEdge[] = [
      {
        id: "A-B",
        source: "A",
        target: "B",
      },
    ];

    const result = normalizeVerticalPosition(lineNodes, edges, false);

    expect(result[0].position.y).toBe(24);
    expect(result[1].position.y).toBe(24);
  });

  it("preserves the relative vertical positions between nodes", () => {
    mockGetBBox();

    const lineNodes = [createNode("A", 50, 20), createNode("B", 122, 40)];
    const edges: WorkflowEdge[] = [];

    const result = normalizeVerticalPosition(lineNodes, edges, false);

    expect(result[1].position.y - result[0].position.y).toBe(20);
  });

  it("keeps the x positions unchanged", () => {
    mockGetBBox();

    const lineNodes = [createNode("A", 50, 0), createNode("B", 122, 0)];
    const edges: WorkflowEdge[] = [];

    const result = normalizeVerticalPosition(lineNodes, edges, false);

    expect(result[0].position.x).toBe(50);
    expect(result[1].position.x).toBe(122);
  });
});

describe("buildCompactTemplateItemFlow", () => {
  it("builds the compact flow with nodes in sequence order without a header", () => {
    mockGetBBox();

    const flowData: WorkflowData = {
      nodes: [createNode("C"), createNode("A"), createNode("B")],
      edges: [
        {
          id: "A-B",
          source: "A",
          target: "B",
        },
        {
          id: "B-C",
          source: "B",
          target: "C",
        },
      ],
    };

    const result = buildCompactTemplateItemFlow("item-1", flowData);

    const contentNodes = result.nodes.filter(
      (node) => node.id !== "execution-row-item-1",
    );

    expect(contentNodes.map((node) => node.id)).toEqual(["A", "B", "C"]);
    expect(
      result.nodes.some((node) => node.id === "execution-header-item-1"),
    ).toBe(false);
    expect(result.nodes.map((node) => node.id)).toEqual([
      "execution-row-item-1",
      "A",
      "B",
      "C",
    ]);
  });

  it("assigns the execution row as the parent of every content node", () => {
    mockGetBBox();

    const flowData: WorkflowData = {
      nodes: [createNode("A"), createNode("B"), createNode("C")],
      edges: [
        {
          id: "A-B",
          source: "A",
          target: "B",
        },
        {
          id: "B-C",
          source: "B",
          target: "C",
        },
      ],
    };

    const result = buildCompactTemplateItemFlow("item-1", flowData);

    const contentNodes = result.nodes.filter(
      (node) => node.id !== "execution-row-item-1",
    );

    expect(
      contentNodes.every((node) => node.parentId === "execution-row-item-1"),
    ).toBe(true);
  });

  it("builds the compact flow with a header", () => {
    mockGetBBox();

    const flowData: WorkflowData = {
      nodes: [createNode("A"), createNode("B")],
      edges: [
        {
          id: "A-B",
          source: "A",
          target: "B",
        },
      ],
    };

    const result = buildCompactTemplateItemFlow("item-1", flowData, true);

    expect(result.nodes.map((node) => node.id)).toEqual([
      "execution-row-item-1",
      "execution-header-item-1",
      "A",
      "B",
    ]);
  });

  it("positions content nodes after the header when prepending a header", () => {
    mockGetBBox();

    const flowData: WorkflowData = {
      nodes: [createNode("A"), createNode("B")],
      edges: [
        {
          id: "A-B",
          source: "A",
          target: "B",
        },
      ],
    };

    const result = buildCompactTemplateItemFlow("item-1", flowData, true);

    const nodeA = result.nodes.find((node) => node.id === "A")!;

    const expectedStartX =
      ROW_LAYOUT.leftPadding + HEADERNODE_LAYOUT.width + ROW_LAYOUT.headerGap;

    expect(nodeA.position.x).toBe(expectedStartX);
  });

  it("returns edges with compact handle configuration", () => {
    mockGetBBox();

    const flowData: WorkflowData = {
      nodes: [createNode("A"), createNode("B"), createNode("C")],
      edges: [
        {
          id: "A-B",
          source: "A",
          target: "B",
        },
        {
          id: "A-C",
          source: "A",
          target: "C",
        },
      ],
    };

    const result = buildCompactTemplateItemFlow("item-1", flowData);

    const adjacentEdge = result.edges.find((edge) => edge.id === "A-B")!;
    const skipEdge = result.edges.find((edge) => edge.id === "A-C")!;

    expect(adjacentEdge).toMatchObject({
      sourceHandle: "right",
      targetHandle: "left",
    });

    expect(skipEdge).toMatchObject({
      sourceHandle: "top",
      targetHandle: "top",
      data: {
        pathType: "smoothstep",
        offset: expect.any(Number),
      },
    });
  });

  it("returns the execution row container as the first node", () => {
    mockGetBBox();

    const flowData: WorkflowData = {
      nodes: [createNode("A"), createNode("B")],
      edges: [
        {
          id: "A-B",
          source: "A",
          target: "B",
        },
      ],
    };

    const result = buildCompactTemplateItemFlow("item-1", flowData);

    expect(result.nodes[0]).toMatchObject({
      id: "execution-row-item-1",
    });
  });
});
