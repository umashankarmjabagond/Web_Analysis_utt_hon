import { describe, expect, it } from "vitest";
import {
  MarkerType,
  type Edge,
} from "@xyflow/react";

import {
  backendToFlow,
  filterTree,
  findNode,
  flowToBackend,
  nodeExists,
  prepareWorkflowForCanvas,
  removeNode,
} from "./utils";

import type {
  BackendWorkflow,
  WorkflowCanvasData,
  WorkflowNode,
} from "../types/workFlowTypes";

import type { TreeNodeData } from "../types/commonTypes";

describe("workflowUtils", () => {
  describe("prepareWorkflowForCanvas", () => {
    it("adds ArrowClosed marker to every edge", () => {
      const workflow = {
        nodes: [],
        edges: [
          {
            id: "1",
            source: "A",
            target: "B",
          },
        ],
        viewport: {
          x: 0,
          y: 0,
          zoom: 1,
        },
      } as unknown as WorkflowCanvasData;

      const result = prepareWorkflowForCanvas(workflow);

      expect(result.edges).toHaveLength(1);

      expect(result.edges[0].markerEnd).toEqual({
        type: MarkerType.ArrowClosed,
      });
    });

    it("preserves nodes and viewport", () => {
      const workflow = {
        nodes: [{ id: "1" }],
        edges: [],
        viewport: {
          x: 20,
          y: 10,
          zoom: 2,
        },
      } as unknown as WorkflowCanvasData;

      const result = prepareWorkflowForCanvas(workflow);

      expect(result.nodes).toEqual(workflow.nodes);
      expect(result.viewport).toEqual(workflow.viewport);
    });
  });

  describe("backendToFlow", () => {
    it("creates nodes from backend elements", () => {
      const backend = {
        Elements: [
          {
            Name: "Email",
            ParentNames: null,
          },
        ],
      } as unknown as BackendWorkflow;

      const result = backendToFlow(backend);

      expect(result.nodes).toHaveLength(1);

      expect(result.nodes[0]).toMatchObject({
        id: "Email",
        type: "baseNode",
      });

      expect(result.nodes[0].data.label).toBe("Email");
    });

    it("creates edges from ParentNames", () => {
      const backend = {
        Elements: [
          {
            Name: "Start",
            ParentNames: null,
          },
          {
            Name: "Email",
            ParentNames: ["Start"],
          },
        ],
      } as unknown as BackendWorkflow;

      const result = backendToFlow(backend);

      expect(result.edges).toHaveLength(1);

      expect(result.edges[0]).toMatchObject({
        source: "Start",
        target: "Email",
        type: "workflow",
      });
    });

    it("creates no edges when ParentNames is null", () => {
      const backend = {
        Elements: [
          {
            Name: "Only",
            ParentNames: null,
          },
        ],
      } as unknown as BackendWorkflow;

      const result = backendToFlow(backend);

      expect(result.edges).toEqual([]);
    });
  });

  describe("flowToBackend", () => {
    it("maps nodes back to backend elements", () => {
      const nodes = [
        {
          id: "Email",
          data: {
            element: {
              Name: "Email",
            },
          },
        },
      ] as unknown as WorkflowNode[];

      const result = flowToBackend(nodes, []);

      expect(result.Elements).toHaveLength(1);
      expect(result.Elements[0].Name).toBe("Email");
      expect(result.Elements[0].ParentNames).toBeNull();
    });

    it("maps incoming edges as ParentNames", () => {
      const nodes = [
        {
          id: "Start",
          data: {
            element: {
              Name: "Start",
            },
          },
        },
        {
          id: "Email",
          data: {
            element: {
              Name: "Email",
            },
          },
        },
      ] as unknown as WorkflowNode[];

      const edges = [
        {
          source: "Start",
          target: "Email",
        },
      ] as unknown as Edge[];

      const result = flowToBackend(nodes, edges);

      expect(result.Elements[1].ParentNames).toEqual([
        "Start",
      ]);
    });
  });

  describe("filterTree", () => {
    const tree: TreeNodeData[] = [
      {
        id: "1",
        label: "Animals",
        children: [
          {
            id: "2",
            label: "Dog",
          },
          {
            id: "3",
            label: "Cat",
          },
        ],
      },
      {
        id: "4",
        label: "Plants",
      },
    ];

    it("returns all nodes when search is empty", () => {
      expect(filterTree(tree, "")).toEqual(tree);
    });

    it("returns matching parent node", () => {
      const result = filterTree(tree, "Animals");

      expect(result).toHaveLength(1);
      expect(result[0].label).toBe("Animals");
    });

    it("returns parent when child matches", () => {
      const result = filterTree(tree, "Dog");

      expect(result).toHaveLength(1);
      expect(result[0].children).toHaveLength(1);
      expect(result[0].children?.[0].label).toBe("Dog");
    });

    it("performs case insensitive search", () => {
      const result = filterTree(tree, "dog");

      expect(result[0].children?.[0].label).toBe("Dog");
    });

    it("returns empty array when nothing matches", () => {
      expect(filterTree(tree, "Bird")).toEqual([]);
    });
  });

  describe("nodeExists", () => {
    const tree: TreeNodeData[] = [
      {
        id: "root",
        label: "Root",
        children: [
          {
            id: "child",
            label: "Child",
            children: [
              {
                id: "grandChild",
                label: "Grand Child",
              },
            ],
          },
        ],
      },
    ];

    it("returns true for root node", () => {
      expect(nodeExists(tree, "root")).toBe(true);
    });

    it("returns true for nested node", () => {
      expect(nodeExists(tree, "grandChild")).toBe(true);
    });

    it("returns false for unknown node", () => {
      expect(nodeExists(tree, "invalid")).toBe(false);
    });
  });

  describe("findNode", () => {
    const tree: TreeNodeData[] = [
      {
        id: "root",
        label: "Root",
        children: [
          {
            id: "child",
            label: "Child",
            children: [
              {
                id: "grandChild",
                label: "Grand Child",
              },
            ],
          },
        ],
      },
    ];

    it("finds root node", () => {
      expect(findNode(tree, "root")?.id).toBe("root");
    });

    it("finds nested node", () => {
      expect(findNode(tree, "grandChild")?.id).toBe(
        "grandChild",
      );
    });

    it("returns null when node is not found", () => {
      expect(findNode(tree, "invalid")).toBeNull();
    });
  });

  describe("removeNode", () => {
    const tree: TreeNodeData[] = [
      {
        id: "root",
        label: "Root",
        children: [
          {
            id: "child",
            label: "Child",
            children: [
              {
                id: "grandChild",
                label: "Grand Child",
              },
            ],
          },
        ],
      },
    ];

    it("removes root node", () => {
      expect(removeNode(tree, "root")).toEqual([]);
    });

    it("removes nested node recursively", () => {
      const result = removeNode(
        tree,
        "grandChild",
      );

      expect(
        result[0].children?.[0].children,
      ).toEqual([]);
    });

    it("returns original tree when node does not exist", () => {
      expect(
        removeNode(tree, "invalid"),
      ).toEqual(tree);
    });
  });
});