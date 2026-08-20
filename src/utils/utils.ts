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

export const allColumnsData: TreeNodeData[] = [
  {
    id: "ds",
    label: "DPR1 Data Preprocessing",
    children: [
      {
        id: "sample",
        label: "TimeSeriesSample",
        children: [
          {
            id: "pv",
            label: "DPR1.PV",
          },
          {
            id: "mode",
            label: "DPR1.MODE",
          },
          {
            id: "op",
            label: "DPR1.OP",
          },
          {
            id: "sp",
            label: "DPR1.SP",
          },
        ],
      },
    ],
  },
];

export const DEFAULT_SELECTED_COLUMNS: TreeNodeData[] = [
  {
    id: "ds",
    label: "DPR1 Data Preprocessing",
    children: [
      {
        id: "sample",
        label: "TimeSeriesSample",
        children: [],
      },
    ],
  },
];

export const buildSelectedTreeFromSource = (
  sourceNodes: TreeNodeData[],
  selectedIds: string[],
): TreeNodeData[] => {
  return sourceNodes
    .map((node) => {
      if (!node.children?.length) {
        return selectedIds.includes(node.id) ? { ...node } : null;
      }

      const children = buildSelectedTreeFromSource(node.children, selectedIds);

      if (children.length > 0) {
        return {
          ...node,
          children,
        };
      }

      return null;
    })
    .filter(Boolean) as TreeNodeData[];
};

export const getSelectedTree = (
  selectedColumns: TreeNodeData[],
  leftCheckedIds: string[],
) => {
  const existingIds = new Set<string>();

  const collectIds = (nodes: TreeNodeData[]) => {
    nodes.forEach((node) => {
      if (!node.children?.length) {
        existingIds.add(node.id);
      }

      if (node.children) {
        collectIds(node.children);
      }
    });
  };

  collectIds(selectedColumns);

  const mergedIds = [...existingIds, ...leftCheckedIds];

  const tree = buildSelectedTreeFromSource(
    allColumnsData,
    mergedIds,
  );

  return tree.length > 0
    ? tree
    : DEFAULT_SELECTED_COLUMNS;
};

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

export const exportWorkflow = (
  nodes: WorkflowNode[],
  edges: Edge[],
  fileName = "workflow.json",
) => {
  const backendWorkflow: BackendWorkflow = flowToBackend(nodes, edges);

  const json = JSON.stringify(backendWorkflow, null, 2);

  const blob = new Blob([json], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const importWorkflow = (
  file: File,
): Promise<ReturnType<typeof backendToFlow>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result;

        if (typeof text !== "string") {
          throw new Error("Unable to read the file.");
        }

        const backendWorkflow: BackendWorkflow = JSON.parse(text);

        const workflow = backendToFlow(backendWorkflow);

        resolve(workflow);
      } catch {
        reject(new Error("Invalid workflow JSON file."));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read the file."));
    };

    reader.readAsText(file);
  });
};
