import {
  describe,
  expect,
  it,
} from "vitest";

import {
  buildTemplateItemFlow,
  createTemplateItemHeaderNode,
} from "./templateItemFlowBuilder";

const createWorkflow = (
  height?: number,
) => ({
  nodes: [
    {
      id: "node-1",
      type: "testNode",
      position: {
        x: 100,
        y: 100,
      },
      measured:
        height !== undefined
          ? { height }
          : undefined,
      data: {
        label: "Node 1",
        status: "default",
      },
    },
  ],
  edges: [
    {
      id: "edge-1",
      source: "node-1",
      target: "node-2",
    },
  ],
});

describe(
  "createTemplateItemHeaderNode",
  () => {
    it("creates header node with default y position", () => {
      const result =
        createTemplateItemHeaderNode({
          itemId: "ITEM_1",
        });

      expect(result).toEqual({
        id: "execution-header-ITEM_1",
        type: "executionHeader",
        position: {
          x: 24,
          y: 178,
        },
        draggable: false,
        selectable: true,
        data: {
          itemId: "ITEM_1",
        },
      });
    });

    it("creates header node with custom y position", () => {
      const result =
        createTemplateItemHeaderNode({
          itemId: "ITEM_1",
          y: 250,
        });

      expect(
        result.position.y,
      ).toBe(250);
    });
  },
);

describe(
  "buildTemplateItemFlow",
  () => {
    it("positions workflow without prepending header", () => {
      const workflow =
        createWorkflow();

      const result =
        buildTemplateItemFlow(
          "ITEM_1",
          workflow as never,
          false,
        );

      expect(
        result.nodes[0]
          .position.x,
      ).toBe(24);

      expect(
        result.nodes[0]
          .position.y,
      ).toBe(140);

      expect(
        result.edges,
      ).toEqual(
        workflow.edges,
      );
    });

    it("prepends execution header when enabled", () => {
      const workflow =
        createWorkflow();

      const result =
        buildTemplateItemFlow(
          "ITEM_1",
          workflow as never,
          true,
        );

      expect(
        result.nodes[0].type,
      ).toBe(
        "executionHeader",
      );

      expect(
        result.nodes[0].data,
      ).toEqual({
        itemId: "ITEM_1",
      });

      expect(
        result.nodes,
      ).toHaveLength(2);
    });

    it("uses measured height when centering header", () => {
      const workflow =
        createWorkflow(100);

      const result =
        buildTemplateItemFlow(
          "ITEM_1",
          workflow as never,
          true,
        );

      expect(
        result.nodes[0]
          .position.y,
      ).toBe(190);

      /**
       * first node is moved to y=140
       * centeredY = 140 + 100/2
       * = 190
       */
    });

    it("uses default height when measured height is undefined", () => {
      const workflow =
        createWorkflow();

      const result =
        buildTemplateItemFlow(
          "ITEM_1",
          workflow as never,
          true,
        );

      expect(
        result.nodes[0]
          .position.y,
      ).toBe(176);

      /**
       * first node positioned at 140
       * 140 + 72/2
       * = 176
       */
    });

    it("shifts node position when workflow origin changes", () => {
      const workflow =
        createWorkflow();

      const result =
        buildTemplateItemFlow(
          "ITEM_1",
          workflow as never,
          true,
        );

      expect(
        result.nodes[1]
          .position.x,
      ).toBe(184);

      expect(
        result.nodes[1]
          .position.y,
      ).toBe(140);

      /**
       * x:
       * 24 + 160 = 184
       */
    });

    it("preserves edges after positioning", () => {
      const workflow =
        createWorkflow();

      const result =
        buildTemplateItemFlow(
          "ITEM_1",
          workflow as never,
          true,
        );

      expect(
        result.edges,
      ).toEqual(
        workflow.edges,
      );
    });
  },
);