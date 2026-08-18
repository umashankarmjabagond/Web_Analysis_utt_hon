import { beforeEach, describe, expect, it, vi } from "vitest";

import { buildTemplateCanvas } from "./templateFlowBuilder";
import { buildTemplateItemFlow } from "./templateItemFlowBuilder";

vi.mock("./templateItemFlowBuilder", () => ({
  buildTemplateItemFlow: vi.fn(),
}));

const mockBuildTemplateItemFlow = vi.mocked(buildTemplateItemFlow);

describe("buildTemplateCanvas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty canvas when workflows are empty", () => {
    const result = buildTemplateCanvas([]);

    expect(result).toEqual({
      nodes: [],
      edges: [],
    });

    expect(mockBuildTemplateItemFlow).not.toHaveBeenCalled();
  });

  it("builds canvas for a single workflow", () => {
    mockBuildTemplateItemFlow.mockReturnValue({
      nodes: [
        {
          id: "n1",
          position: {
            x: 100,
            y: 50,
          },
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

    const result = buildTemplateCanvas([workflow]);

    expect(mockBuildTemplateItemFlow).toHaveBeenCalledWith(
      "item-1",
      workflow.workflow,
      true,
    );

    expect(result.nodes).toHaveLength(1);
    expect(result.edges).toHaveLength(1);

    expect(result.nodes[0]?.position.y).toBe(50);
  });

  it("shifts each workflow by 200 pixels per row", () => {
    mockBuildTemplateItemFlow.mockReturnValue({
      nodes: [
        {
          id: "n1",
          position: {
            x: 0,
            y: 100,
          },
        },
      ],
      edges: [],
    } as never);

    const result = buildTemplateCanvas([
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
    ]);

    expect(result.nodes).toHaveLength(3);

    expect(result.nodes[0]?.position.y).toBe(100);
    expect(result.nodes[1]?.position.y).toBe(300);
    expect(result.nodes[2]?.position.y).toBe(500);
  });

  it("applies startIndex when building a later page", () => {
    mockBuildTemplateItemFlow.mockReturnValue({
      nodes: [
        {
          id: "n1",
          position: {
            x: 0,
            y: 100,
          },
        },
      ],
      edges: [],
    } as never);

    const result = buildTemplateCanvas(
      [
        {
          itemId: "item-11",
          workflow: {
            nodes: [],
            edges: [],
          },
        },
        {
          itemId: "item-12",
          workflow: {
            nodes: [],
            edges: [],
          },
        },
      ],
      10,
    );

    expect(result.nodes).toHaveLength(2);

    /*
     * startIndex = 10
     *
     * First workflow:
     * (10 + 0) * 200 + 100 = 2100
     *
     * Second workflow:
     * (10 + 1) * 200 + 100 = 2300
     */
    expect(result.nodes[0]?.position.y).toBe(2100);
    expect(result.nodes[1]?.position.y).toBe(2300);
  });

  it("combines nodes and edges from multiple workflows", () => {
    mockBuildTemplateItemFlow
      .mockReturnValueOnce({
        nodes: [
          {
            id: "n1",
            position: {
              x: 0,
              y: 0,
            },
          },
        ],
        edges: [
          {
            id: "e1",
          },
        ],
      } as never)
      .mockReturnValueOnce({
        nodes: [
          {
            id: "n2",
            position: {
              x: 0,
              y: 0,
            },
          },
        ],
        edges: [
          {
            id: "e2",
          },
        ],
      } as never);

    const result = buildTemplateCanvas([
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
    ]);

    expect(result.nodes).toHaveLength(2);
    expect(result.edges).toHaveLength(2);

    expect(result.edges).toEqual([{ id: "e1" }, { id: "e2" }]);
  });

  it("calls buildTemplateItemFlow for every workflow", () => {
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

    buildTemplateCanvas(workflows);

    expect(mockBuildTemplateItemFlow).toHaveBeenCalledTimes(3);
  });

  it("passes each workflow to buildTemplateItemFlow in order", () => {
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
    ];

    buildTemplateCanvas(workflows);

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
  });
});
