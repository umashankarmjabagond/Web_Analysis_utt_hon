import { MarkerType, type Edge } from "@xyflow/react";
import type {
  BackendElement,
  BackendWorkflow,
  WorkflowCanvasData,
  WorkflowEdge,
  WorkflowNode,
} from "../types/workFlowTypes";
import type { TreeNodeData } from "../types/commonTypes";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function prepareWorkflowForCanvas(
  workflow: WorkflowCanvasData,
): WorkflowCanvasData {
  return {
    nodes: workflow.nodes,

    edges: workflow.edges.map((edge: Edge) => ({
      ...edge,

      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    })),

    viewport: workflow.viewport,
  };
}

const X_GAP = 320;
const Y_GAP = 180;

/* -------------------------------------------------------------------------- */
/*                           Backend -> React Flow                            */
/* -------------------------------------------------------------------------- */

export const backendToFlow = (
  workflow: BackendWorkflow,
): WorkflowCanvasData => {
  const nodes: WorkflowNode[] = workflow.Elements.map((element, index) => ({
    id: element.Name,

    type: "baseNode",

    position: {
      x: (index % 4) * X_GAP,
      y: Math.floor(index / 4) * Y_GAP,
    },

    data: {
      label: element.Name,

      element: structuredClone(element),
    },
  }));

  const edges: WorkflowEdge[] = [];

  workflow.Elements.forEach((element) => {
    if (!element.ParentNames?.length) return;

    element.ParentNames.forEach((parentName) => {
      edges.push({
        id: `${parentName}-${element.Name}`,

        source: parentName,

        target: element.Name,

        type: "workflow",

        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      });
    });
  });

  return {
    nodes,
    edges,
  };
};

/* -------------------------------------------------------------------------- */
/*                           React Flow -> Backend                            */
/* -------------------------------------------------------------------------- */

export const flowToBackend = (
  nodes: WorkflowNode[],
  edges: Edge[],
): BackendWorkflow => {
  const elements: BackendElement[] = nodes.map((node) => {
    const incomingEdges = edges.filter((edge) => edge.target === node.id);

    return {
      ...structuredClone(node.data.element),

      Name: node.id,

      ParentNames:
        incomingEdges.length > 0
          ? incomingEdges.map((edge) => edge.source)
          : null,
    };
  });

  return {
    LoopName: "",

    TemplateName: "",

    AnalysisName: "",

    Location: "",

    Description: "",

    HistorianFile: "",

    settings: {},

    thresholds: {},

    Elements: elements,
  };
};

/* -------------------------------------------------------------------------- */
/*                           filterTree                                       */
/* -------------------------------------------------------------------------- */

export const filterTree = (
  nodes: TreeNodeData[],
  search: string,
): TreeNodeData[] => {
  if (!search.trim()) {
    return nodes;
  }

  const query = search.toLowerCase();

  return nodes.reduce<TreeNodeData[]>((acc, node) => {
    const isMatch = node.label.toLowerCase().includes(query);

    if (isMatch) {
      acc.push(node);
      return acc;
    }

    const filteredChildren = node.children
      ? filterTree(node.children, query)
      : [];

    if (filteredChildren.length > 0) {
      acc.push({
        ...node,
        children: filteredChildren,
      });
    }

    return acc;
  }, []);
};

export function nodeExists(nodes: TreeNodeData[], targetId: string): boolean {
  for (const node of nodes) {
    if (node.id === targetId) {
      return true;
    }

    if (node.children && nodeExists(node.children, targetId)) {
      return true;
    }
  }

  return false;
}

export function findNode(
  nodes: TreeNodeData[],
  targetId: string,
): TreeNodeData | null {
  for (const node of nodes) {
    if (node.id === targetId) {
      return node;
    }

    if (node.children) {
      const result = findNode(node.children, targetId);

      if (result) {
        return result;
      }
    }
  }

  return null;
}

export function removeNode(
  nodes: TreeNodeData[],
  targetId: string,
): TreeNodeData[] {
  return nodes
    .filter((node) => node.id !== targetId)
    .map((node) => ({
      ...node,
      children: node.children ? removeNode(node.children, targetId) : undefined,
    }));
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
