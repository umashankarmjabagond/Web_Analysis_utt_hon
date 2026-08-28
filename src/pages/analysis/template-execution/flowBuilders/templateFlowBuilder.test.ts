import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Edge } from "@xyflow/react";

import { buildTemplateCanvas } from "./templateFlowBuilder";

import {
  EXECUTION_VIEW_MODE,
  type ExecutionFlowNode,
  type TemplateExecutionWorkflow,
} from "../../../../types/templateExecution";

import { buildTemplateItemFlow } from "./templateItemFlowBuilder";
import { buildCompactTemplateItemFlow } from "./compactLayoutBuilder";
import { buildComfortableTemplateItemFlow } from "./comfortableLayoutBuilder";

import { CANVAS_LAYOUT, ROW_GAP } from "./layoutConstants";

/**
 * templateFlowBuilder uses the comfortable/compact builders directly.
 *
 * Keep the mock partial so that the other exports from
 * templateItemFlowBuilder remain available to comfortableLayoutBuilder.
 */
vi.mock("./templateItemFlowBuilder", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("./templateItemFlowBuilder")>();

  return {
    ...actual,
    buildTemplateItemFlow: vi.fn(),
  };
});

vi.mock("./compactLayoutBuilder", () => ({
  buildCompactTemplateItemFlow: vi.fn(),
}));

vi.mock("./comfortableLayoutBuilder", () => ({
  buildComfortableTemplateItemFlow: vi.fn(),
}));

const mockBuildTemplateItemFlow = vi.mocked(buildTemplateItemFlow);

const mockBuildCompactTemplateItemFlow = vi.mocked(
  buildCompactTemplateItemFlow,
);

const mockBuildComfortableTemplateItemFlow = vi.mocked(
  buildComfortableTemplateItemFlow,
);

describe("buildTemplateCanvas", () => {
  const COMFORTABLE_MODE = EXECUTION_VIEW_MODE.COMFORTABLE;
  const COMPACT_MODE = EXECUTION_VIEW_MODE.COMPACT;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRowNode = (
    id: string,
    width: number,
    height: number,
    x = 0,
    y = 0,
  ): ExecutionFlowNode =>
    ({
      id,
      type: "executionRow",
      position: {
        x,
        y,
      },
      style: {
        width,
        height,
      },
      data: {
        itemId: id,
      },
    }) as ExecutionFlowNode;

  const createWorkflow = (itemId: string): TemplateExecutionWorkflow => ({
    itemId,
    workflow: {
      nodes: [],
      edges: [],
    },
  });

  it("returns empty canvas when workflows are empty", () => {
    const result = buildTemplateCanvas([], COMFORTABLE_MODE);

    expect(result).toEqual({
      nodes: [],
      edges: [],
      nextY: CANVAS_LAYOUT.rowTop,
    });

    expect(mockBuildComfortableTemplateItemFlow).not.toHaveBeenCalled();
    expect(mockBuildCompactTemplateItemFlow).not.toHaveBeenCalled();
    expect(mockBuildTemplateItemFlow).not.toHaveBeenCalled();
  });

  it("builds canvas for a single workflow in comfortable mode", () => {
    const rowNode = createRowNode("row-1", 500, 100, 100, 50);

    const workflowNode = {
      id: "node-1",
      type: "customNode",
      position: {
        x: 200,
        y: 100,
      },
      data: {},
    } as never;

    const edge = {
      id: "e1",
      source: "node-1",
      target: "node-2",
    } as Edge;

    mockBuildComfortableTemplateItemFlow.mockReturnValue({
      nodes: [rowNode, workflowNode],
      edges: [edge],
    });

    const workflow = createWorkflow("item-1");

    const result = buildTemplateCanvas([workflow], COMFORTABLE_MODE);

    expect(mockBuildComfortableTemplateItemFlow).toHaveBeenCalledTimes(1);

    expect(mockBuildComfortableTemplateItemFlow).toHaveBeenCalledWith(
      "item-1",
      workflow.workflow,
      true,
    );

    expect(mockBuildTemplateItemFlow).not.toHaveBeenCalled();
    expect(mockBuildCompactTemplateItemFlow).not.toHaveBeenCalled();

    expect(result.nodes).toHaveLength(2);
    expect(result.edges).toHaveLength(1);

    expect(result.nodes[0]?.position).toEqual({
      x: CANVAS_LAYOUT.rowLeft,
      y: CANVAS_LAYOUT.rowTop,
    });

    expect(result.nodes[0]?.style?.width).toBe(500);

    expect(result.nodes[1]?.position).toEqual({
      x: 200,
      y: 100,
    });

    expect(result.nextY).toBe(CANVAS_LAYOUT.rowTop + 100 + ROW_GAP);
  });

  it("positions rows using their actual heights and row gap", () => {
    mockBuildComfortableTemplateItemFlow
      .mockReturnValueOnce({
        nodes: [createRowNode("row-1", 400, 100)],
        edges: [],
      })
      .mockReturnValueOnce({
        nodes: [createRowNode("row-2", 450, 150)],
        edges: [],
      });

    const result = buildTemplateCanvas(
      [createWorkflow("item-1"), createWorkflow("item-2")],
      COMFORTABLE_MODE,
    );

    expect(result.nodes[0]?.position.y).toBe(CANVAS_LAYOUT.rowTop);

    expect(result.nodes[1]?.position.y).toBe(
      CANVAS_LAYOUT.rowTop + 100 + ROW_GAP,
    );

    expect(result.nextY).toBe(
      CANVAS_LAYOUT.rowTop + 100 + ROW_GAP + 150 + ROW_GAP,
    );
  });

  it("starts from the provided startY", () => {
    const startY = 500;

    const firstRowHeight = 100;
    const secondRowHeight = 150;

    mockBuildComfortableTemplateItemFlow
      .mockReturnValueOnce({
        nodes: [createRowNode("row-1", 400, firstRowHeight)],
        edges: [],
      })
      .mockReturnValueOnce({
        nodes: [createRowNode("row-2", 450, secondRowHeight)],
        edges: [],
      });

    const result = buildTemplateCanvas(
      [createWorkflow("item-1"), createWorkflow("item-2")],
      COMFORTABLE_MODE,
      startY,
    );

    expect(result.nodes[0]?.position.y).toBe(startY);

    expect(result.nodes[1]?.position.y).toBe(startY + firstRowHeight + ROW_GAP);

    expect(result.nextY).toBe(
      startY + firstRowHeight + ROW_GAP + secondRowHeight + ROW_GAP,
    );
  });

  it("uses the maximum row width for all row containers", () => {
    const firstRowWidth = 400;
    const maxRowWidth = 600;

    mockBuildComfortableTemplateItemFlow
      .mockReturnValueOnce({
        nodes: [createRowNode("row-1", firstRowWidth, 100)],
        edges: [],
      })
      .mockReturnValueOnce({
        nodes: [createRowNode("row-2", maxRowWidth, 100)],
        edges: [],
      });

    const result = buildTemplateCanvas(
      [createWorkflow("item-1"), createWorkflow("item-2")],
      COMFORTABLE_MODE,
    );

    expect(result.nodes[0]?.style?.width).toBe(maxRowWidth);
    expect(result.nodes[1]?.style?.width).toBe(maxRowWidth);
  });

  it("combines nodes and edges from multiple workflows", () => {
    const row1 = createRowNode("row-1", 400, 100);

    const node1 = {
      id: "node-1",
      type: "customNode",
      position: {
        x: 50,
        y: 50,
      },
      data: {},
    } as never;

    const row2 = createRowNode("row-2", 400, 100);

    const node2 = {
      id: "node-2",
      type: "customNode",
      position: {
        x: 50,
        y: 50,
      },
      data: {},
    } as never;

    const edge1 = {
      id: "e1",
      source: "node-1",
      target: "node-2",
    } as Edge;

    const edge2 = {
      id: "e2",
      source: "node-2",
      target: "node-1",
    } as Edge;

    mockBuildComfortableTemplateItemFlow
      .mockReturnValueOnce({
        nodes: [row1, node1],
        edges: [edge1],
      })
      .mockReturnValueOnce({
        nodes: [row2, node2],
        edges: [edge2],
      });

    const result = buildTemplateCanvas(
      [createWorkflow("item-1"), createWorkflow("item-2")],
      COMFORTABLE_MODE,
    );

    expect(result.nodes).toHaveLength(4);
    expect(result.edges).toHaveLength(2);

    expect(result.nodes.map((node) => node.id)).toEqual([
      "row-1",
      "node-1",
      "row-2",
      "node-2",
    ]);

    expect(result.edges).toEqual([edge1, edge2]);
  });

  it("calls buildComfortableTemplateItemFlow for every workflow in order in comfortable mode", () => {
    mockBuildComfortableTemplateItemFlow.mockReturnValue({
      nodes: [],
      edges: [],
    });

    const workflows = [
      createWorkflow("item-1"),
      createWorkflow("item-2"),
      createWorkflow("item-3"),
    ];

    buildTemplateCanvas(workflows, COMFORTABLE_MODE);

    expect(mockBuildComfortableTemplateItemFlow).toHaveBeenCalledTimes(3);

    expect(mockBuildComfortableTemplateItemFlow).toHaveBeenNthCalledWith(
      1,
      "item-1",
      workflows[0].workflow,
      true,
    );

    expect(mockBuildComfortableTemplateItemFlow).toHaveBeenNthCalledWith(
      2,
      "item-2",
      workflows[1].workflow,
      true,
    );

    expect(mockBuildComfortableTemplateItemFlow).toHaveBeenNthCalledWith(
      3,
      "item-3",
      workflows[2].workflow,
      true,
    );

    expect(mockBuildCompactTemplateItemFlow).not.toHaveBeenCalled();
    expect(mockBuildTemplateItemFlow).not.toHaveBeenCalled();
  });

  it("calls buildCompactTemplateItemFlow for every workflow in order in compact mode", () => {
    mockBuildCompactTemplateItemFlow.mockReturnValue({
      nodes: [],
      edges: [],
    });

    const workflows = [
      createWorkflow("item-1"),
      createWorkflow("item-2"),
      createWorkflow("item-3"),
    ];

    buildTemplateCanvas(workflows, COMPACT_MODE);

    expect(mockBuildCompactTemplateItemFlow).toHaveBeenCalledTimes(3);

    expect(mockBuildCompactTemplateItemFlow).toHaveBeenNthCalledWith(
      1,
      "item-1",
      workflows[0].workflow,
      true,
    );

    expect(mockBuildCompactTemplateItemFlow).toHaveBeenNthCalledWith(
      2,
      "item-2",
      workflows[1].workflow,
      true,
    );

    expect(mockBuildCompactTemplateItemFlow).toHaveBeenNthCalledWith(
      3,
      "item-3",
      workflows[2].workflow,
      true,
    );

    expect(mockBuildComfortableTemplateItemFlow).not.toHaveBeenCalled();
    expect(mockBuildTemplateItemFlow).not.toHaveBeenCalled();
  });

  it("does not change non-row node positions", () => {
    const rowNode = createRowNode("row-1", 500, 100, 100, 200);

    const workflowNode = {
      id: "node-1",
      type: "customNode",
      position: {
        x: 250,
        y: 300,
      },
      data: {},
    } as never;

    mockBuildComfortableTemplateItemFlow.mockReturnValue({
      nodes: [rowNode, workflowNode],
      edges: [],
    });

    const result = buildTemplateCanvas(
      [createWorkflow("item-1")],
      COMFORTABLE_MODE,
    );

    const nonRowNode = result.nodes.find((node) => node.id === "node-1");

    expect(nonRowNode?.position).toEqual({
      x: 250,
      y: 300,
    });
  });

  it("sets every row container x position to rowLeft", () => {
    mockBuildComfortableTemplateItemFlow
      .mockReturnValueOnce({
        nodes: [createRowNode("row-1", 400, 100, 999, 0)],
        edges: [],
      })
      .mockReturnValueOnce({
        nodes: [createRowNode("row-2", 600, 120, 888, 0)],
        edges: [],
      });

    const result = buildTemplateCanvas(
      [createWorkflow("item-1"), createWorkflow("item-2")],
      COMFORTABLE_MODE,
    );

    expect(result.nodes[0]?.position.x).toBe(CANVAS_LAYOUT.rowLeft);

    expect(result.nodes[1]?.position.x).toBe(CANVAS_LAYOUT.rowLeft);
  });

  it("keeps row y positions independent of the original row y", () => {
    mockBuildComfortableTemplateItemFlow
      .mockReturnValueOnce({
        nodes: [createRowNode("row-1", 400, 100, 0, 9999)],
        edges: [],
      })
      .mockReturnValueOnce({
        nodes: [createRowNode("row-2", 400, 100, 0, -9999)],
        edges: [],
      });

    const result = buildTemplateCanvas(
      [createWorkflow("item-1"), createWorkflow("item-2")],
      COMFORTABLE_MODE,
    );

    expect(result.nodes[0]?.position.y).toBe(CANVAS_LAYOUT.rowTop);

    expect(result.nodes[1]?.position.y).toBe(
      CANVAS_LAYOUT.rowTop + 100 + ROW_GAP,
    );
  });
});
