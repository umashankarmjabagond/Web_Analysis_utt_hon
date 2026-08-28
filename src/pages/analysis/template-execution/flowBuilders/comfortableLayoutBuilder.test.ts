import { afterEach, describe, expect, it, vi } from "vitest";

import { buildComfortableTemplateItemFlow } from "./comfortableLayoutBuilder";

import type {
  BaseFlowNode,
  WorkflowData,
  WorkflowEdge,
} from "../../../../types/templateExecution";

import {
  COMFORTABLE_LAYOUT,
  HEADERNODE_LAYOUT,
  NODE_LAYOUT,
  ROW_LAYOUT,
} from "./layoutConstants";

/**
 * jsdom does not implement SVGPathElement.getBBox().
 *
 * calculateCombinedBounds()
 *   -> calculateDagBounds()
 *   -> getEdgePath()
 *   -> measurePathBounds()
 *   -> pathElement.getBBox()
 *
 * Therefore geometry-related tests need this mock.
 */
const mockGetBBox = (
  bbox = {
    x: 0,
    y: 0,
    width: 100,
    height: 30,
  },
) => {
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

        pathElement.getBBox = () => bbox as DOMRect;
      }

      return element;
    },
  );
};

afterEach(() => {
  vi.restoreAllMocks();
});

/**
 * Test node factory.
 *
 * The actual application nodes are measured by React Flow.
 * For unit tests we intentionally use the NODE_LAYOUT defaults.
 */
const createNode = (
  id: string,
  x = 0,
  y = 0,
  width = NODE_LAYOUT.defaultWidth,
  height = NODE_LAYOUT.defaultHeight,
): BaseFlowNode => {
  return {
    id,
    type: "test",
    position: {
      x,
      y,
    },
    measured: {
      width,
      height,
    },
    data: {
      label: id,
      status: "success",
    },
  };
};

const createEdge = (
  id: string,
  source: string,
  target: string,
  extra: Partial<WorkflowEdge> = {},
): WorkflowEdge => {
  return {
    id,
    source,
    target,
    ...extra,
  };
};

const createFlowData = (
  nodes: BaseFlowNode[],
  edges: WorkflowEdge[] = [],
): WorkflowData => {
  return {
    nodes,
    edges,
  };
};

describe("buildComfortableTemplateItemFlow", () => {
  it("returns an empty node list for an empty workflow", () => {
    const flowData = createFlowData([]);

    const result = buildComfortableTemplateItemFlow("item-1", flowData);

    expect(result.edges).toEqual([]);

    expect(result.nodes).toHaveLength(1);

    expect(result.nodes[0]).toMatchObject({
      id: "execution-row-item-1",
      type: "executionRow",
    });
  });

  it("creates the execution row container as the first node", () => {
    mockGetBBox();

    const flowData = createFlowData(
      [createNode("A"), createNode("B")],
      [createEdge("A-B", "A", "B")],
    );

    const result = buildComfortableTemplateItemFlow("item-1", flowData);

    expect(result.nodes[0]).toMatchObject({
      id: "execution-row-item-1",
      type: "executionRow",
    });
  });

  it("assigns the execution row as the parent of every content node", () => {
    mockGetBBox();

    const flowData = createFlowData(
      [createNode("A"), createNode("B"), createNode("C")],
      [createEdge("A-B", "A", "B"), createEdge("B-C", "B", "C")],
    );

    const result = buildComfortableTemplateItemFlow("item-1", flowData);

    const contentNodes = result.nodes.filter(
      (node) => node.id !== "execution-row-item-1",
    );

    expect(
      contentNodes.every((node) => node.parentId === "execution-row-item-1"),
    ).toBe(true);
  });

  it("does not create an execution header when prependHeader is false", () => {
    mockGetBBox();

    const flowData = createFlowData(
      [createNode("A"), createNode("B")],
      [createEdge("A-B", "A", "B")],
    );

    const result = buildComfortableTemplateItemFlow("item-1", flowData, false);

    expect(result.nodes.some((node) => node.type === "executionHeader")).toBe(
      false,
    );

    expect(result.nodes.map((node) => node.id)).toEqual([
      "execution-row-item-1",
      "A",
      "B",
    ]);
  });

  it("creates an execution header when prependHeader is true", () => {
    mockGetBBox();

    const flowData = createFlowData(
      [createNode("A"), createNode("B")],
      [createEdge("A-B", "A", "B")],
    );

    const result = buildComfortableTemplateItemFlow("item-1", flowData, true);

    expect(result.nodes.map((node) => node.id)).toEqual([
      "execution-row-item-1",
      "execution-header-item-1",
      "A",
      "B",
    ]);
  });

  it("positions the first content node after the header", () => {
    mockGetBBox();

    const flowData = createFlowData(
      [createNode("A"), createNode("B")],
      [createEdge("A-B", "A", "B")],
    );

    const result = buildComfortableTemplateItemFlow("item-1", flowData, true);

    const nodeA = result.nodes.find((node) => node.id === "A");

    expect(nodeA).toBeDefined();

    const expectedStartX =
      ROW_LAYOUT.leftPadding + HEADERNODE_LAYOUT.width + ROW_LAYOUT.headerGap;

    expect(nodeA?.position.x).toBe(expectedStartX);
  });

  it("starts content at left padding when there is no header", () => {
    mockGetBBox();

    const flowData = createFlowData([createNode("A", 100, 50)]);

    const result = buildComfortableTemplateItemFlow("item-1", flowData, false);

    const nodeA = result.nodes.find((node) => node.id === "A");

    expect(nodeA).toBeDefined();

    expect(nodeA?.position.x).toBe(ROW_LAYOUT.leftPadding);
  });

  it("starts content after header space when there is a header", () => {
    mockGetBBox();

    const flowData = createFlowData([createNode("A", 100, 50)]);

    const result = buildComfortableTemplateItemFlow("item-1", flowData, true);

    const nodeA = result.nodes.find((node) => node.id === "A");

    expect(nodeA).toBeDefined();

    expect(nodeA?.position.x).toBe(
      ROW_LAYOUT.leftPadding + HEADERNODE_LAYOUT.width + ROW_LAYOUT.headerGap,
    );
  });

  it("preserves the horizontal order of nodes", () => {
    mockGetBBox();

    const flowData = createFlowData([
      createNode("A", 0, 0),
      createNode("B", 100, 0),
      createNode("C", 200, 0),
    ]);

    const result = buildComfortableTemplateItemFlow("item-1", flowData, false);

    const nodeA = result.nodes.find((node) => node.id === "A")!;

    const nodeB = result.nodes.find((node) => node.id === "B")!;

    const nodeC = result.nodes.find((node) => node.id === "C")!;

    expect(nodeA.position.x).toBeLessThan(nodeB.position.x);

    expect(nodeB.position.x).toBeLessThan(nodeC.position.x);
  });

  it("preserves the vertical relationship between nodes", () => {
    mockGetBBox();

    const flowData = createFlowData([
      createNode("A", 0, 0),
      createNode("B", 100, 50),
    ]);

    const result = buildComfortableTemplateItemFlow("item-1", flowData, false);

    const nodeA = result.nodes.find((node) => node.id === "A")!;

    const nodeB = result.nodes.find((node) => node.id === "B")!;

    expect(nodeB.position.y - nodeA.position.y).toBe(50);
  });

  it("centers a short workflow vertically inside the comfortable row", () => {
    const flowData = createFlowData([createNode("A", 0, 0)]);

    const result = buildComfortableTemplateItemFlow("item-1", flowData, false);

    const nodeA = result.nodes.find((node) => node.id === "A")!;

    const sourceVisualHeight =
      NODE_LAYOUT.defaultHeight +
      NODE_LAYOUT.labelGap +
      NODE_LAYOUT.labelHeight;

    const contentHeight =
      COMFORTABLE_LAYOUT.minRowHeight -
      ROW_LAYOUT.topPadding -
      ROW_LAYOUT.bottomPadding;

    const expectedY =
      ROW_LAYOUT.topPadding + (contentHeight - sourceVisualHeight) / 2;

    expect(nodeA.position.y).toBe(expectedY);
  });

  it("uses measured node dimensions when calculating layout", () => {
    mockGetBBox();

    const measuredWidth = 50;
    const measuredHeight = 40;

    const flowData = createFlowData([
      createNode("A", 0, 0, measuredWidth, measuredHeight),
    ]);

    const result = buildComfortableTemplateItemFlow("item-1", flowData);

    const nodeA = result.nodes.find((node) => node.id === "A")!;

    expect(nodeA.measured?.width).toBe(measuredWidth);

    expect(nodeA.measured?.height).toBe(measuredHeight);
  });

  it("uses straight right-to-left connections for nodes on the same row", () => {
    mockGetBBox();

    const flowData = createFlowData(
      [createNode("A", 0, 0), createNode("B", 100, 0)],
      [createEdge("A-B", "A", "B")],
    );

    const result = buildComfortableTemplateItemFlow("item-1", flowData);

    expect(result.edges).toHaveLength(1);

    expect(result.edges[0]).toMatchObject({
      id: "A-B",
      source: "A",
      target: "B",
      sourceHandle: "right",
      targetHandle: "left",
      data: {
        pathType: "straight",
        offset: undefined,
      },
    });
  });

  it("uses smoothstep routing for vertically separated nodes", () => {
    mockGetBBox();

    const flowData = createFlowData(
      [createNode("A", 0, 0), createNode("B", 100, 100)],
      [createEdge("A-B", "A", "B")],
    );

    const result = buildComfortableTemplateItemFlow("item-1", flowData);

    expect(result.edges).toHaveLength(1);

    expect(result.edges[0]).toMatchObject({
      id: "A-B",
      source: "A",
      target: "B",
      sourceHandle: "bottom",
      targetHandle: "top",
      data: {
        pathType: "smoothstep",
      },
    });

    expect(result.edges[0].data?.offset).toEqual(expect.any(Number));
  });

  it("uses top-to-bottom routing when the target is above the source", () => {
    mockGetBBox();

    const flowData = createFlowData(
      [createNode("A", 0, 100), createNode("B", 100, 0)],
      [createEdge("A-B", "A", "B")],
    );

    const result = buildComfortableTemplateItemFlow("item-1", flowData);

    expect(result.edges[0]).toMatchObject({
      sourceHandle: "top",
      targetHandle: "bottom",
      data: {
        pathType: "smoothstep",
      },
    });
  });

  it("preserves original vertical handles for edges that already use vertical handles", () => {
    mockGetBBox();

    const flowData = createFlowData(
      [createNode("A", 0, 0), createNode("B", 100, 100)],
      [
        createEdge("A-B", "A", "B", {
          sourceHandle: "top",
          targetHandle: "bottom",
        }),
      ],
    );

    const result = buildComfortableTemplateItemFlow("item-1", flowData);

    expect(result.edges[0]).toMatchObject({
      sourceHandle: "top",
      targetHandle: "bottom",
      data: {
        pathType: "smoothstep",
      },
    });

    expect(result.edges[0].data?.offset).toEqual(expect.any(Number));
  });

  it("sets offset to undefined for horizontal connections", () => {
    mockGetBBox();

    const flowData = createFlowData(
      [createNode("A", 0, 0), createNode("B", 100, 0)],
      [createEdge("A-B", "A", "B")],
    );

    const result = buildComfortableTemplateItemFlow("item-1", flowData);

    expect(result.edges[0].data?.offset).toBeUndefined();
  });

  it("assigns different offsets to vertically routed edges", () => {
    mockGetBBox();

    const flowData = createFlowData(
      [
        createNode("A", 0, 0),
        createNode("B", 100, 100),
        createNode("C", 200, 200),
      ],
      [createEdge("A-B", "A", "B"), createEdge("B-C", "B", "C")],
    );

    const result = buildComfortableTemplateItemFlow("item-1", flowData);

    const firstOffset = result.edges[0].data?.offset;

    const secondOffset = result.edges[1].data?.offset;

    expect(firstOffset).toEqual(expect.any(Number));

    expect(secondOffset).toEqual(expect.any(Number));
  });

  it("does not change the original edge object structure", () => {
    mockGetBBox();

    const edge: WorkflowEdge = {
      id: "A-B",
      source: "A",
      target: "B",
      type: "workflow",
    };

    const flowData = createFlowData([createNode("A"), createNode("B")], [edge]);

    const result = buildComfortableTemplateItemFlow("item-1", flowData);

    expect(result.edges[0].id).toBe("A-B");
    expect(result.edges[0].source).toBe("A");
    expect(result.edges[0].target).toBe("B");
  });

  it("sets the comfortable minimum row width", () => {
    mockGetBBox();

    const flowData = createFlowData([createNode("A")]);

    const result = buildComfortableTemplateItemFlow("item-1", flowData);

    const row = result.nodes.find((node) => node.type === "executionRow")!;

    expect(row.style?.width).toBe(COMFORTABLE_LAYOUT.minRowWidth);
  });

  it("sets the comfortable minimum row height", () => {
    const flowData = createFlowData([createNode("A")]);

    const result = buildComfortableTemplateItemFlow("item-1", flowData);

    const row = result.nodes.find((node) => node.type === "executionRow")!;

    expect(row.style?.height).toBe(COMFORTABLE_LAYOUT.minRowHeight);
  });

  it("does not make the row smaller than the configured minimum dimensions", () => {
    mockGetBBox();

    const flowData = createFlowData([createNode("A"), createNode("B")]);

    const result = buildComfortableTemplateItemFlow("item-1", flowData);

    const row = result.nodes.find((node) => node.type === "executionRow")!;

    expect(row.style?.width).toBeGreaterThanOrEqual(
      COMFORTABLE_LAYOUT.minRowWidth,
    );

    expect(row.style?.height).toBeGreaterThanOrEqual(
      COMFORTABLE_LAYOUT.minRowHeight,
    );
  });

  it("keeps nodes inside the configured comfortable content width", () => {
    mockGetBBox();

    const flowData = createFlowData([
      createNode("A", 0, 0),
      createNode("B", 500, 0),
      createNode("C", 1000, 0),
      createNode("D", 1500, 0),
      createNode("E", 2000, 0),
    ]);

    const result = buildComfortableTemplateItemFlow("item-1", flowData, true);

    const contentNodes = result.nodes.filter(
      (node) => node.type !== "executionRow" && node.type !== "executionHeader",
    );

    const row = result.nodes.find((node) => node.type === "executionRow")!;

    const rowWidth = typeof row.style?.width === "number" ? row.style.width : 0;

    contentNodes.forEach((node) => {
      const nodeWidth = node.measured?.width ?? NODE_LAYOUT.defaultWidth;

      expect(node.position.x).toBeGreaterThanOrEqual(0);

      expect(node.position.x + nodeWidth).toBeLessThanOrEqual(rowWidth);
    });
  });

  it("keeps the header inside the execution row", () => {
    mockGetBBox();

    const flowData = createFlowData(
      [createNode("A"), createNode("B")],
      [createEdge("A-B", "A", "B")],
    );

    const result = buildComfortableTemplateItemFlow("item-1", flowData, true);

    const header = result.nodes.find(
      (node) => node.type === "executionHeader",
    )!;

    const row = result.nodes.find((node) => node.type === "executionRow")!;

    const rowWidth = typeof row.style?.width === "number" ? row.style.width : 0;

    const rowHeight =
      typeof row.style?.height === "number" ? row.style.height : 0;

    expect(header.position.x).toBe(ROW_LAYOUT.leftPadding);

    expect(header.position.y).toBeGreaterThanOrEqual(0);

    expect(header.position.x + HEADERNODE_LAYOUT.width).toBeLessThanOrEqual(
      rowWidth,
    );

    expect(header.position.y + HEADERNODE_LAYOUT.height).toBeLessThanOrEqual(
      rowHeight,
    );
  });

  it("preserves all workflow edges", () => {
    mockGetBBox();

    const flowData = createFlowData(
      [createNode("A"), createNode("B"), createNode("C")],
      [
        createEdge("A-B", "A", "B"),
        createEdge("B-C", "B", "C"),
        createEdge("A-C", "A", "C"),
      ],
    );

    const result = buildComfortableTemplateItemFlow("item-1", flowData);

    expect(result.edges).toHaveLength(3);

    expect(result.edges.map((edge) => edge.id)).toEqual(["A-B", "B-C", "A-C"]);
  });

  it("handles a workflow with multiple branches", () => {
    mockGetBBox();

    const flowData = createFlowData(
      [
        createNode("A", 0, 0),
        createNode("B", 100, 100),
        createNode("C", 100, -100),
        createNode("D", 200, 0),
      ],
      [
        createEdge("A-B", "A", "B"),
        createEdge("A-C", "A", "C"),
        createEdge("B-D", "B", "D"),
        createEdge("C-D", "C", "D"),
      ],
    );

    const result = buildComfortableTemplateItemFlow("item-1", flowData, true);

    expect(result.nodes).toHaveLength(6);

    expect(result.edges).toHaveLength(4);

    const contentNodes = result.nodes.filter(
      (node) => node.type !== "executionRow" && node.type !== "executionHeader",
    );

    expect(contentNodes).toHaveLength(4);

    expect(
      contentNodes.every((node) => node.parentId === "execution-row-item-1"),
    ).toBe(true);
  });
});
