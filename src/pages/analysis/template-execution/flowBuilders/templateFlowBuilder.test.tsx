import {
  describe,
  expect,
  it,
  vi,
  beforeEach,
} from "vitest";

import { buildTemplateCanvas } from "./templateFlowBuilder";
import { buildTemplateItemFlow } from "./templateItemFlowBuilder";

vi.mock(
  "./templateItemFlowBuilder",
  () => ({
    buildTemplateItemFlow:
      vi.fn(),
  }),
);

const mockBuildTemplateItemFlow =
  vi.mocked(
    buildTemplateItemFlow,
  );

describe(
  "buildTemplateCanvas",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("returns empty canvas when workflows are empty", () => {
      const result =
        buildTemplateCanvas([]);

      expect(result).toEqual({
        nodes: [],
        edges: [],
      });
    });

    it("builds canvas for a single workflow", () => {
      mockBuildTemplateItemFlow.mockReturnValue(
        {
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
        } as never,
      );

      const result =
        buildTemplateCanvas([
          {
            itemId: "item-1",
            workflow: {
              nodes: [],
              edges: [],
            },
          },
        ]);

      expect(
        mockBuildTemplateItemFlow,
      ).toHaveBeenCalledWith(
        "item-1",
        {
          nodes: [],
          edges: [],
        },
        true,
      );

      expect(
        result.nodes,
      ).toHaveLength(1);

      expect(
        result.edges,
      ).toHaveLength(1);

      expect(
        result.nodes[0].position.y,
      ).toBe(50);
    });

    it("shifts second workflow nodes by row height", () => {
      mockBuildTemplateItemFlow.mockReturnValue(
        {
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
        } as never,
      );

      const result =
        buildTemplateCanvas([
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

      expect(
        result.nodes,
      ).toHaveLength(2);

      expect(
        result.nodes[0].position.y,
      ).toBe(100);

      expect(
        result.nodes[1].position.y,
      ).toBe(300);
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

      const result =
        buildTemplateCanvas([
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

      expect(
        result.nodes,
      ).toHaveLength(2);

      expect(
        result.edges,
      ).toHaveLength(2);

      expect(
        result.edges,
      ).toEqual([
        { id: "e1" },
        { id: "e2" },
      ]);
    });

    it("calls builder for every workflow", () => {
      mockBuildTemplateItemFlow.mockReturnValue(
        {
          nodes: [],
          edges: [],
        } as never,
      );

      buildTemplateCanvas([
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

      expect(
        mockBuildTemplateItemFlow,
      ).toHaveBeenCalledTimes(
        3,
      );
    });
  },
);