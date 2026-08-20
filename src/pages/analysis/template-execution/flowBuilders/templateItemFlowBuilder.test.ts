import { describe, expect, it } from "vitest";
import {
  buildTemplateItemFlow,
  createTemplateItemHeaderNode,
} from "./templateItemFlowBuilder";

const CANVAS_LEFT = 24;
const CANVAS_TOP = 24;

const ROW_TOP_PADDING = 24;
const ROW_RIGHT_PADDING = 24;
const ROW_BOTTOM_PADDING = 24;
const ROW_LEFT_PADDING = 50;
const HEADER_GAP = 12;

const HEADER_WIDTH = 160;
const HEADER_HEIGHT = 24;

const DEFAULT_NODE_WIDTH = 30;
const DEFAULT_NODE_HEIGHT = 30;
const LABEL_HEIGHT = 15;
const LABEL_GAP = 2;

const createWorkflow = (options?: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}) => {
  const { x = 100, y = 100, width, height } = options ?? {};

  return {
    nodes: [
      {
        id: "node-1",
        type: "testNode",
        position: {
          x,
          y,
        },
        measured:
          width !== undefined || height !== undefined
            ? {
                ...(width !== undefined ? { width } : {}),
                ...(height !== undefined ? { height } : {}),
              }
            : undefined,
        data: {
          label: "Node 1",
          status: "default",
        },
      },
    ],
    edges: [],
  };
};

const mockBBox = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
};

const originalCreateElementNS = document.createElementNS;

beforeEach(() => {
  vi.clearAllMocks();

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
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createTemplateItemHeaderNode", () => {
  it("creates an execution header node", () => {
    const itemId = "ITEM_1";
    const y = 100;

    const result = createTemplateItemHeaderNode({
      itemId,
      y,
    });

    expect(result).toEqual({
      id: `execution-header-${itemId}`,
      parentId: `execution-row-${itemId}`,
      type: "executionHeader",
      position: {
        x: ROW_LEFT_PADDING,
        y,
      },
      draggable: false,
      selectable: false,
      data: {
        itemId,
      },
    });
  });

  it("uses the provided y position", () => {
    const y = 250;

    const result = createTemplateItemHeaderNode({
      itemId: "ITEM_1",
      y,
    });

    expect(result.position.y).toBe(y);
  });
});

describe("buildTemplateItemFlow", () => {
  it("builds a workflow without a header", () => {
    const itemId = "ITEM_1";
    const workflow = createWorkflow();

    const result = buildTemplateItemFlow(itemId, workflow as never, false);

    const node = result.nodes.find((node) => node.id === "node-1");
    const row = result.nodes.find((node) => node.type === "executionRow");

    expect(node?.position.x).toBe(ROW_LEFT_PADDING);
    expect(node?.position.y).toBe(ROW_TOP_PADDING);

    expect(row).toBeDefined();
    expect(row?.id).toBe(`execution-row-${itemId}`);
  });

  it("prepends an execution header when enabled", () => {
    const itemId = "ITEM_1";
    const workflow = createWorkflow();

    const result = buildTemplateItemFlow(itemId, workflow as never, true);

    const header = result.nodes.find((node) => node.type === "executionHeader");

    expect(header).toBeDefined();
    expect(header?.id).toBe(`execution-header-${itemId}`);
    expect(header?.parentId).toBe(`execution-row-${itemId}`);
    expect(header?.data).toEqual({
      itemId,
    });

    expect(result.nodes).toHaveLength(3);
  });

  it("positions the workflow after the header when header is enabled", () => {
    const workflow = createWorkflow();

    const result = buildTemplateItemFlow("ITEM_1", workflow as never, true);

    const node = result.nodes.find((node) => node.id === "node-1");

    const expectedX = ROW_LEFT_PADDING + HEADER_WIDTH + HEADER_GAP;

    expect(node?.position.x).toBe(expectedX);
    expect(node?.position.y).toBe(ROW_TOP_PADDING);
  });

  it("uses the measured node height when calculating visual bounds", () => {
    const measuredHeight = 100;
    const workflow = createWorkflow({
      height: measuredHeight,
    });

    const result = buildTemplateItemFlow("ITEM_1", workflow as never, false);

    const row = result.nodes.find((node) => node.type === "executionRow");

    const visualHeight = measuredHeight + LABEL_GAP + LABEL_HEIGHT;

    const expectedRowHeight =
      visualHeight + ROW_TOP_PADDING + ROW_BOTTOM_PADDING;

    expect(row?.style?.height).toBe(expectedRowHeight);
  });

  it("uses the default node height when measured height is unavailable", () => {
    const workflow = createWorkflow();

    const result = buildTemplateItemFlow("ITEM_1", workflow as never, false);

    const row = result.nodes.find((node) => node.type === "executionRow");

    const visualHeight = DEFAULT_NODE_HEIGHT + LABEL_GAP + LABEL_HEIGHT;

    const expectedRowHeight =
      visualHeight + ROW_TOP_PADDING + ROW_BOTTOM_PADDING;

    expect(row?.style?.height).toBe(expectedRowHeight);
  });

  it("uses measured node width when calculating row width", () => {
    const measuredWidth = 100;
    const workflow = createWorkflow({
      width: measuredWidth,
    });

    const result = buildTemplateItemFlow("ITEM_1", workflow as never, false);

    const row = result.nodes.find((node) => node.type === "executionRow");

    const expectedRowWidth =
      ROW_LEFT_PADDING + measuredWidth + ROW_RIGHT_PADDING;

    expect(row?.style?.width).toBe(expectedRowWidth);
  });

  it("uses the default node width when measured width is unavailable", () => {
    const workflow = createWorkflow();

    const result = buildTemplateItemFlow("ITEM_1", workflow as never, false);

    const row = result.nodes.find((node) => node.type === "executionRow");

    const expectedRowWidth =
      ROW_LEFT_PADDING + DEFAULT_NODE_WIDTH + ROW_RIGHT_PADDING;

    expect(row?.style?.width).toBe(expectedRowWidth);
  });

  it("centers the header vertically for a measured node height", () => {
    const measuredHeight = 100;

    const workflow = createWorkflow({
      height: measuredHeight,
    });

    const result = buildTemplateItemFlow("ITEM_1", workflow as never, true);

    const header = result.nodes.find((node) => node.type === "executionHeader");

    const visualHeight = measuredHeight + LABEL_GAP + LABEL_HEIGHT;

    const contentHeight = Math.max(visualHeight, HEADER_HEIGHT);

    const expectedHeaderY =
      ROW_TOP_PADDING + (contentHeight - HEADER_HEIGHT) / 2;

    expect(header?.position.y).toBe(expectedHeaderY);
  });

  it("centers the header using the default node height", () => {
    const workflow = createWorkflow();

    const result = buildTemplateItemFlow("ITEM_1", workflow as never, true);

    const header = result.nodes.find((node) => node.type === "executionHeader");

    const visualHeight = DEFAULT_NODE_HEIGHT + LABEL_GAP + LABEL_HEIGHT;

    const contentHeight = Math.max(visualHeight, HEADER_HEIGHT);

    const expectedHeaderY =
      ROW_TOP_PADDING + (contentHeight - HEADER_HEIGHT) / 2;

    expect(header?.position.y).toBe(expectedHeaderY);
  });

  it("assigns workflow nodes to the execution row", () => {
    const itemId = "ITEM_1";
    const workflow = createWorkflow();

    const result = buildTemplateItemFlow(itemId, workflow as never, false);

    const node = result.nodes.find((node) => node.id === "node-1");

    expect(node?.parentId).toBe(`execution-row-${itemId}`);
  });

  it("creates the execution row container", () => {
    const itemId = "ITEM_1";
    const workflow = createWorkflow();

    const result = buildTemplateItemFlow(itemId, workflow as never, false);

    const row = result.nodes.find((node) => node.type === "executionRow");

    expect(row).toEqual(
      expect.objectContaining({
        id: `execution-row-${itemId}`,
        type: "executionRow",
        position: {
          x: CANVAS_LEFT,
          y: CANVAS_TOP,
        },
        zIndex: -1,
        draggable: false,
        selectable: true,
        data: {
          itemId,
        },
      }),
    );
  });

  it("preserves workflow edges", () => {
    const workflow = {
      nodes: [
        {
          id: "node-1",
          type: "testNode",
          position: {
            x: 100,
            y: 100,
          },
          data: {},
        },
        {
          id: "node-2",
          type: "testNode",
          position: {
            x: 200,
            y: 100,
          },
          data: {},
        },
      ],
      edges: [
        {
          id: "edge-1",
          source: "node-1",
          target: "node-2",
        },
      ],
    };

    const result = buildTemplateItemFlow("ITEM_1", workflow as never, false);

    expect(result.edges).toEqual(workflow.edges);
  });

  it("includes the header before workflow nodes", () => {
    const workflow = createWorkflow();

    const result = buildTemplateItemFlow("ITEM_1", workflow as never, true);

    expect(result.nodes.map((node) => node.type)).toEqual([
      "executionRow",
      "executionHeader",
      "testNode",
    ]);
  });

  it("does not include a header when prependHeader is false", () => {
    const workflow = createWorkflow();

    const result = buildTemplateItemFlow("ITEM_1", workflow as never, false);

    expect(result.nodes.some((node) => node.type === "executionHeader")).toBe(
      false,
    );
  });
});
