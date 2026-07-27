import { MarkerType } from "@xyflow/react";

import type { Edge } from "@xyflow/react";
import type {
  BackendElement,
  BackendWorkflow,
  WorkflowCanvasData,
  WorkflowEdge,
  WorkflowNode,
} from "../types/workFlowTypes";

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
