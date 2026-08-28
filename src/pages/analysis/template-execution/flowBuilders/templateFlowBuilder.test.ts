import { beforeEach, describe, expect, it, vi } from "vitest";

import { buildTemplateCanvas } from "./templateFlowBuilder";
import { buildTemplateItemFlow } from "./templateItemFlowBuilder";
import { buildCompactTemplateItemFlow } from "./compactLayoutBuilder";
import { EXECUTION_VIEW_MODE } from "../../../../types/templateExecution";

vi.mock("./templateItemFlowBuilder", () => ({
  buildTemplateItemFlow: vi.fn(),
}));

vi.mock("./compactLayoutBuilder", () => ({
  buildCompactTemplateItemFlow: vi.fn(),
}));

const mockBuildTemplateItemFlow = vi.mocked(buildTemplateItemFlow);
const mockBuildCompactTemplateItemFlow = vi.mocked(
  buildCompactTemplateItemFlow,
);

describe("buildTemplateCanvas", () => {
  const VIEW_MODE = EXECUTION_VIEW_MODE.COMFORTABLE;
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty canvas when workflows are empty", () => {
    const result = buildTemplateCanvas([], VIEW_MODE);

    expect(result).toEqual({
      nodes: [],
      edges: [],
      nextY: 24,
    });

    expect(mockBuildTemplateItemFlow).not.toHaveBeenCalled();
  });

  it("builds canvas for a single workflow", () => {
    mockBuildTemplateItemFlow.mockReturnValue({
      nodes: [
        {
          id: "row-1",
          type: "executionRow",
          position: {
            x: 100,
            y: 50,
          },
          style: {
            width: 500,
            height: 100,
          },
        },
        {
          id: "node-1",
          type: "customNode",
          position: {
            x: 200,
            y: 100,
          },
          data: {},
        },
      ],
      edges: [
        {
          id: "e1",
        },
      ],
    } as never);

    const workflow = {
      itemId: "item-1",
      workflow: {
        nodes: [],
        edges: [],
      },
    };

    const result = buildTemplateCanvas([workflow], VIEW_MODE);

    expect(mockBuildTemplateItemFlow).toHaveBeenCalledWith(
      "item-1",
      workflow.workflow,
      true,
    );

    expect(result.nodes).toHaveLength(2);
    expect(result.edges).toHaveLength(1);

    // executionRow is positioned by the canvas builder
    expect(result.nodes[0]?.position).toEqual({
      x: 24,
      y: 24,
    });

    expect(result.nodes[0]?.style?.width).toBe(500);

    // Other nodes keep their original position
    expect(result.nodes[1]?.position).toEqual({
      x: 200,
      y: 100,
    });

    expect(result.nextY).toBe(148);
  });

  it("positions rows using their actual heights and row gap", () => {
    mockBuildTemplateItemFlow
      .mockReturnValueOnce({
        nodes: [
          {
            id: "row-1",
            type: "executionRow",
            position: { x: 0, y: 0 },
            style: {
              width: 400,
              height: 100,
            },
          },
        ],
        edges: [],
      } as never)
      .mockReturnValueOnce({
        nodes: [
          {
            id: "row-2",
            type: "executionRow",
            position: { x: 0, y: 0 },
            style: {
              width: 450,
              height: 150,
            },
          },
        ],
        edges: [],
      } as never);

    const result = buildTemplateCanvas(
      [
        {
          itemId: "item-1",
          workflow: {
            nodes: [],
            edges: [],
          },
        },
        {
          itemId: "item-2",
          workflow: {
            nodes: [],
            edges: [],
          },
        },
      ],
      VIEW_MODE,
    );

    expect(result.nodes[0]?.position.y).toBe(24);
    expect(result.nodes[1]?.position.y).toBe(148);

    expect(result.nextY).toBe(322);
  });

  it("starts from the provided startY", () => {
    const startY = 500;
    const firstRowHeight = 100;
    const secondRowHeight = 150;
    const rowGap = 24;

    mockBuildTemplateItemFlow
      .mockReturnValueOnce({
        nodes: [
          {
            id: "row-1",
            type: "executionRow",
            position: { x: 0, y: 0 },
            style: {
              width: 400,
              height: firstRowHeight,
            },
          },
        ],
        edges: [],
      } as never)
      .mockReturnValueOnce({
        nodes: [
          {
            id: "row-2",
            type: "executionRow",
            position: { x: 0, y: 0 },
            style: {
              width: 450,
              height: secondRowHeight,
            },
          },
        ],
        edges: [],
      } as never);

    const result = buildTemplateCanvas(
      [
        {
          itemId: "item-1",
          workflow: {
            nodes: [],
            edges: [],
          },
        },
        {
          itemId: "item-2",
          workflow: {
            nodes: [],
            edges: [],
          },
        },
      ],
      VIEW_MODE,
      startY,
    );

    expect(result.nodes[0]?.position.y).toBe(startY);

    expect(result.nodes[1]?.position.y).toBe(startY + firstRowHeight + rowGap);

    expect(result.nextY).toBe(
      startY + firstRowHeight + rowGap + secondRowHeight + rowGap,
    );
  });

  it("uses the maximum row width for all row containers", () => {
    const firstRowWidth = 400;
    const maxRowWidth = 600;

    mockBuildTemplateItemFlow
      .mockReturnValueOnce({
        nodes: [
          {
            id: "row-1",
            type: "executionRow",
            position: { x: 0, y: 0 },
            style: {
              width: firstRowWidth,
              height: 100,
            },
          },
        ],
        edges: [],
      } as never)
      .mockReturnValueOnce({
        nodes: [
          {
            id: "row-2",
            type: "executionRow",
            position: { x: 0, y: 0 },
            style: {
              width: maxRowWidth,
              height: 100,
            },
          },
        ],
        edges: [],
      } as never);

    const result = buildTemplateCanvas(
      [
        {
          itemId: "item-1",
          workflow: {
            nodes: [],
            edges: [],
          },
        },
        {
          itemId: "item-2",
          workflow: {
            nodes: [],
            edges: [],
          },
        },
      ],
      VIEW_MODE,
    );

    expect(result.nodes[0]?.style?.width).toBe(maxRowWidth);
    expect(result.nodes[1]?.style?.width).toBe(maxRowWidth);
  });

  it("combines nodes and edges from multiple workflows", () => {
    mockBuildTemplateItemFlow
      .mockReturnValueOnce({
        nodes: [
          {
            id: "row-1",
            type: "executionRow",
            position: { x: 0, y: 0 },
            style: {
              width: 400,
              height: 100,
            },
          },
          {
            id: "node-1",
            type: "customNode",
            position: { x: 50, y: 50 },
            data: {},
          },
        ],
        edges: [{ id: "e1" }],
      } as never)
      .mockReturnValueOnce({
        nodes: [
          {
            id: "row-2",
            type: "executionRow",
            position: { x: 0, y: 0 },
            style: {
              width: 400,
              height: 100,
            },
          },
          {
            id: "node-2",
            type: "customNode",
            position: { x: 50, y: 50 },
            data: {},
          },
        ],
        edges: [{ id: "e2" }],
      } as never);

    const result = buildTemplateCanvas(
      [
        {
          itemId: "item-1",
          workflow: {
            nodes: [],
            edges: [],
          },
        },
        {
          itemId: "item-2",
          workflow: {
            nodes: [],
            edges: [],
          },
        },
      ],
      VIEW_MODE,
    );

    expect(result.nodes).toHaveLength(4);
    expect(result.edges).toHaveLength(2);

    expect(result.nodes.map((node) => node.id)).toEqual([
      "row-1",
      "node-1",
      "row-2",
      "node-2",
    ]);

    expect(result.edges).toEqual([{ id: "e1" }, { id: "e2" }]);
  });

  it("calls buildTemplateItemFlow for every workflow in order in comfortable mode", () => {
    mockBuildTemplateItemFlow.mockReturnValue({
      nodes: [],
      edges: [],
    } as never);

    const workflows = [
      {
        itemId: "item-1",
        workflow: {
          nodes: [],
          edges: [],
        },
      },
      {
        itemId: "item-2",
        workflow: {
          nodes: [],
          edges: [],
        },
      },
      {
        itemId: "item-3",
        workflow: {
          nodes: [],
          edges: [],
        },
      },
    ];

    buildTemplateCanvas(workflows, VIEW_MODE);

    expect(mockBuildTemplateItemFlow).toHaveBeenCalledTimes(3);

    expect(mockBuildTemplateItemFlow).toHaveBeenNthCalledWith(
      1,
      "item-1",
      workflows[0].workflow,
      true,
    );

    expect(mockBuildTemplateItemFlow).toHaveBeenNthCalledWith(
      2,
      "item-2",
      workflows[1].workflow,
      true,
    );

    expect(mockBuildTemplateItemFlow).toHaveBeenNthCalledWith(
      3,
      "item-3",
      workflows[2].workflow,
      true,
    );
  });

  it("calls buildCompactTemplateItemFlow for every workflow in order in compact mode", () => {
    mockBuildCompactTemplateItemFlow.mockReturnValue({
      nodes: [],
      edges: [],
    } as never);

    const workflows = [
      {
        itemId: "item-1",
        workflow: { nodes: [], edges: [] },
      },
      {
        itemId: "item-2",
        workflow: { nodes: [], edges: [] },
      },
      {
        itemId: "item-3",
        workflow: { nodes: [], edges: [] },
      },
    ];

    buildTemplateCanvas(workflows, EXECUTION_VIEW_MODE.COMPACT);

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

    expect(mockBuildTemplateItemFlow).not.toHaveBeenCalled();
  });
});
