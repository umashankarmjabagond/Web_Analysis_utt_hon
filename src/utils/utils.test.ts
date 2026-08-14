import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MarkerType, type Edge } from "@xyflow/react";

import {
  backendToFlow,
  cn,
  exportWorkflow,
  filterTree,
  findNode,
  flowToBackend,
  importWorkflow,
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

const createTree = (): TreeNodeData[] => [
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
      {
        id: "sibling",
        label: "Sibling",
      },
    ],
  },
  {
    id: "other",
    label: "Other",
  },
];

const createBackend = (): BackendWorkflow =>
  ({
    LoopName: "Loop",
    TemplateName: "Template",
    AnalysisName: "Analysis",
    Location: "Location",
    Description: "Description",
    HistorianFile: "",
    settings: {},
    thresholds: {},
    Elements: [
      {
        Name: "Start",
        ParentNames: null,
        elementType: "Start",
      },
      {
        Name: "Email",
        ParentNames: ["Start"],
        elementType: "Email",
      },
    ],
  }) as unknown as BackendWorkflow;

describe("utils", () => {
  // prepareWorkflowForCanvas

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
          {
            id: "2",
            source: "B",
            target: "C",
          },
        ],
        viewport: {
          x: 0,
          y: 0,
          zoom: 1,
        },
      } as unknown as WorkflowCanvasData;

      const result = prepareWorkflowForCanvas(workflow);

      expect(result.edges).toHaveLength(2);

      result.edges.forEach((edge) => {
        expect(edge.markerEnd).toEqual({
          type: MarkerType.ArrowClosed,
        });
      });
    });

    it("preserves nodes, edge properties and viewport", () => {
      const workflow = {
        nodes: [{ id: "node-1" }],
        edges: [
          {
            id: "edge-1",
            source: "A",
            target: "B",
            type: "workflow",
          },
        ],
        viewport: {
          x: 20,
          y: 10,
          zoom: 2,
        },
      } as unknown as WorkflowCanvasData;

      const result = prepareWorkflowForCanvas(workflow);

      expect(result.nodes).toBe(workflow.nodes);
      expect(result.viewport).toBe(workflow.viewport);

      expect(result.edges[0]).toMatchObject({
        id: "edge-1",
        source: "A",
        target: "B",
        type: "workflow",
      });
    });
  });

  // backendToFlow

  describe("backendToFlow", () => {
    it("converts backend elements into flow nodes", () => {
      const result = backendToFlow(createBackend());

      expect(result.nodes).toHaveLength(2);

      expect(result.nodes[0]).toMatchObject({
        id: "Start",
        type: "baseNode",
        position: {
          x: 0,
          y: 0,
        },
        data: {
          label: "Start",
        },
      });

      expect(result.nodes[1]).toMatchObject({
        id: "Email",
        type: "baseNode",
        position: {
          x: 320,
          y: 0,
        },
        data: {
          label: "Email",
        },
      });
    });

    it("creates edges from ParentNames", () => {
      const result = backendToFlow(createBackend());

      expect(result.edges).toEqual([
        {
          id: "Start-Email",
          source: "Start",
          target: "Email",
          type: "workflow",
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        },
      ]);
    });

    it("creates multiple edges for multiple parents", () => {
      const backend = {
        Elements: [
          {
            Name: "A",
            ParentNames: null,
          },
          {
            Name: "B",
            ParentNames: null,
          },
          {
            Name: "C",
            ParentNames: ["A", "B"],
          },
        ],
      } as unknown as BackendWorkflow;

      const result = backendToFlow(backend);

      expect(result.edges).toHaveLength(2);

      expect(result.edges.map((edge) => edge.source)).toEqual(["A", "B"]);
    });

    it("creates no edge when ParentNames is missing", () => {
      const backend = {
        Elements: [
          {
            Name: "Only",
          },
        ],
      } as unknown as BackendWorkflow;

      expect(backendToFlow(backend).edges).toEqual([]);
    });

    it("creates positions in rows of four nodes", () => {
      const backend = {
        Elements: Array.from({ length: 5 }, (_, index) => ({
          Name: `Node${index}`,
          ParentNames: null,
        })),
      } as unknown as BackendWorkflow;

      const result = backendToFlow(backend);

      expect(result.nodes[0].position).toEqual({
        x: 0,
        y: 0,
      });

      expect(result.nodes[3].position).toEqual({
        x: 960,
        y: 0,
      });

      expect(result.nodes[4].position).toEqual({
        x: 0,
        y: 180,
      });
    });

    it("clones backend element data", () => {
      const backend = createBackend();

      const result = backendToFlow(backend);

      expect(result.nodes[0].data.element).toEqual(backend.Elements[0]);

      expect(result.nodes[0].data.element).not.toBe(backend.Elements[0]);
    });
  });

  // flowToBackend

  describe("flowToBackend", () => {
    it("converts nodes into backend elements", () => {
      const nodes = [
        {
          id: "Start",
          data: {
            element: {
              Name: "Start",
              elementType: "Start",
            },
          },
        },
      ] as unknown as WorkflowNode[];

      const result = flowToBackend(nodes, []);

      expect(result).toMatchObject({
        LoopName: "",
        TemplateName: "",
        AnalysisName: "",
        Location: "",
        Description: "",
        HistorianFile: "",
        settings: {},
        thresholds: {},
      });

      expect(result.Elements).toHaveLength(1);

      expect(result.Elements[0]).toMatchObject({
        Name: "Start",
        elementType: "Start",
        ParentNames: null,
      });
    });

    it("maps incoming edges to ParentNames", () => {
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
      ] as Edge[];

      const result = flowToBackend(nodes, edges);

      expect(result.Elements[0].ParentNames).toBeNull();

      expect(result.Elements[1].ParentNames).toEqual(["Start"]);
    });

    it("supports multiple incoming edges", () => {
      const nodes = [
        {
          id: "A",
          data: {
            element: {
              Name: "A",
            },
          },
        },
        {
          id: "B",
          data: {
            element: {
              Name: "B",
            },
          },
        },
        {
          id: "C",
          data: {
            element: {
              Name: "C",
            },
          },
        },
      ] as unknown as WorkflowNode[];

      const edges = [
        {
          source: "A",
          target: "C",
        },
        {
          source: "B",
          target: "C",
        },
      ] as Edge[];

      const result = flowToBackend(nodes, edges);

      expect(result.Elements[2].ParentNames).toEqual(["A", "B"]);
    });

    it("does not mutate original element data", () => {
      const element = {
        Name: "Email",
        elementType: "Email",
      };

      const nodes = [
        {
          id: "Email",
          data: {
            element,
          },
        },
      ] as unknown as WorkflowNode[];

      const result = flowToBackend(nodes, []);

      expect(result.Elements[0]).toEqual({
        Name: "Email",
        elementType: "Email",
        ParentNames: null,
      });

      expect(element).toEqual({
        Name: "Email",
        elementType: "Email",
      });
    });
  });

  // filterTree

  describe("filterTree", () => {
    const tree = createTree();

    it("returns original tree for empty search", () => {
      expect(filterTree(tree, "")).toBe(tree);
    });

    it("returns original tree for whitespace search", () => {
      expect(filterTree(tree, "   ")).toBe(tree);
    });

    it("finds matching parent", () => {
      const result = filterTree(tree, "Root");

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("root");
    });

    it("finds matching child and preserves parent", () => {
      const result = filterTree(tree, "Grand");

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("root");
      expect(result[0].children).toHaveLength(1);
      expect(result[0].children?.[0].id).toBe("child");
    });

    it("performs case insensitive search", () => {
      const result = filterTree(tree, "grand child");

      expect(result[0].children?.[0].children?.[0].label).toBe("Grand Child");
    });

    it("returns empty array when no node matches", () => {
      expect(filterTree(tree, "Dog")).toEqual([]);
    });

    it("keeps matching sibling nodes", () => {
      const result = filterTree(tree, "Child");

      expect(result[0].children).toHaveLength(1);
      expect(result[0].children?.[0].id).toBe("child");
    });
  });

  // nodeExists

  describe("nodeExists", () => {
    const tree = createTree();

    it.each([
      ["root", true],
      ["child", true],
      ["grandChild", true],
      ["sibling", true],
      ["other", true],
      ["invalid", false],
    ])("returns %s => %s", (id, expected) => {
      expect(nodeExists(tree, id)).toBe(expected);
    });

    it("handles nodes without children", () => {
      expect(
        nodeExists(
          [
            {
              id: "simple",
              label: "Simple",
            },
          ],
          "simple",
        ),
      ).toBe(true);
    });
  });

  // findNode

  describe("findNode", () => {
    const tree = createTree();

    it.each(["root", "child", "grandChild", "sibling", "other"])(
      "finds %s",
      (id) => {
        expect(findNode(tree, id)?.id).toBe(id);
      },
    );

    it("returns null when node does not exist", () => {
      expect(findNode(tree, "invalid")).toBeNull();
    });

    it("handles nodes without children", () => {
      expect(
        findNode(
          [
            {
              id: "simple",
              label: "Simple",
            },
          ],
          "simple",
        )?.label,
      ).toBe("Simple");
    });
  });

  // removeNode

  describe("removeNode", () => {
    it("removes root node", () => {
      const tree = createTree();

      expect(removeNode(tree, "root")).toEqual([
        {
          id: "other",
          label: "Other",
        },
      ]);
    });

    it("removes nested node", () => {
      const result = removeNode(createTree(), "grandChild");

      expect(result[0].children?.[0].children).toEqual([]);
    });

    it("removes a child without affecting siblings", () => {
      const result = removeNode(createTree(), "child");

      expect(result[0].children).toEqual([
        {
          id: "sibling",
          label: "Sibling",
        },
      ]);
    });

    it("returns equivalent tree when node does not exist", () => {
      expect(removeNode(createTree(), "invalid")).toEqual(createTree());
    });

    it("handles nodes without children", () => {
      const tree = [
        {
          id: "simple",
          label: "Simple",
        },
      ];

      expect(removeNode(tree, "invalid")).toEqual(tree);
    });
  });

  // cn

  describe("cn", () => {
    it("merges class names", () => {
      expect(cn("text-red-500", "font-bold")).toContain("text-red-500");

      expect(cn("text-red-500", "font-bold")).toContain("font-bold");
    });

    it("merges conflicting Tailwind classes", () => {
      expect(cn("px-2", "px-4")).toBe("px-4");
    });

    it("supports conditional values", () => {
      const isHidden = false;

      expect(cn("base", isHidden && "hidden", "active")).toBe("base active");
    });

    it("includes conditional class when condition is true", () => {
      const isHidden = true;

      expect(cn("base", isHidden && "hidden", "active")).toBe(
        "base hidden active",
      );
    });
  });

  // exportWorkflow

  describe("exportWorkflow", () => {
    let click: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      click = vi.fn();

      vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:test");

      vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

      vi.spyOn(document, "createElement").mockReturnValue({
        href: "",
        download: "",
        click,
      } as unknown as HTMLAnchorElement);

      vi.spyOn(document.body, "appendChild").mockImplementation((node) => node);

      vi.spyOn(document.body, "removeChild").mockImplementation((node) => node);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("exports workflow as JSON file", () => {
      const nodes = [
        {
          id: "Email",
          data: {
            element: {
              Name: "Email",
              elementType: "Email",
            },
          },
        },
      ] as unknown as WorkflowNode[];

      exportWorkflow(nodes, [], "test-workflow.json");

      expect(URL.createObjectURL).toHaveBeenCalledOnce();

      expect(click).toHaveBeenCalledOnce();

      expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:test");
    });

    it("uses default file name", () => {
      let anchor: HTMLAnchorElement;

      vi.spyOn(document, "createElement").mockImplementation(() => {
        anchor = {
          href: "",
          download: "",
          click,
        } as unknown as HTMLAnchorElement;

        return anchor;
      });

      exportWorkflow([], []);

      expect(anchor!.download).toBe("workflow.json");
    });

    it("uses supplied file name", () => {
      let anchor: HTMLAnchorElement;

      vi.spyOn(document, "createElement").mockImplementation(() => {
        anchor = {
          href: "",
          download: "",
          click,
        } as unknown as HTMLAnchorElement;

        return anchor;
      });

      exportWorkflow([], [], "custom.json");

      expect(anchor!.download).toBe("custom.json");
    });
  });

  // importWorkflow

  describe("importWorkflow", () => {
    class MockFileReader {
      result: string | null = null;

      onload: ((event: ProgressEvent<FileReader>) => void) | null = null;

      onerror: ((event: ProgressEvent<FileReader>) => void) | null = null;

      readAsText() {
        this.result = JSON.stringify(createBackend());

        this.onload?.({
          target: this,
        } as unknown as ProgressEvent<FileReader>);
      }
    }

    beforeEach(() => {
      vi.stubGlobal("FileReader", MockFileReader);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("imports valid workflow JSON", async () => {
      const file = new File(
        [JSON.stringify(createBackend())],
        "workflow.json",
        {
          type: "application/json",
        },
      );

      const result = await importWorkflow(file);

      expect(result.nodes).toHaveLength(2);
      expect(result.edges).toHaveLength(1);

      expect(result.nodes[0].id).toBe("Start");

      expect(result.nodes[1].id).toBe("Email");
    });

    it("rejects when file contains invalid JSON", async () => {
      class InvalidFileReader extends MockFileReader {
        readAsText() {
          this.result = "{ invalid json";

          this.onload?.({
            target: this,
          } as unknown as ProgressEvent<FileReader>);
        }
      }

      vi.stubGlobal("FileReader", InvalidFileReader);

      await expect(
        importWorkflow(new File(["invalid"], "workflow.json")),
      ).rejects.toThrow("Invalid workflow JSON file.");
    });

    it("rejects when FileReader result is not a string", async () => {
      class EmptyFileReader extends MockFileReader {
        result = null;

        readAsText() {
          this.onload?.({
            target: this,
          } as unknown as ProgressEvent<FileReader>);
        }
      }

      vi.stubGlobal("FileReader", EmptyFileReader);

      await expect(
        importWorkflow(new File([""], "workflow.json")),
      ).rejects.toThrow("Invalid workflow JSON file.");
    });

    it("rejects when FileReader fails", async () => {
      class ErrorFileReader extends MockFileReader {
        readAsText() {
          this.onerror?.({} as ProgressEvent<FileReader>);
        }
      }

      vi.stubGlobal("FileReader", ErrorFileReader);

      await expect(
        importWorkflow(new File(["test"], "workflow.json")),
      ).rejects.toThrow("Failed to read the file.");
    });
  });
});
