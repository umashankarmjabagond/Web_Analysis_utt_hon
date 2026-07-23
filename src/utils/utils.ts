import { MarkerType } from "@xyflow/react";

import type { Edge } from "@xyflow/react";
import type { WorkflowCanvasData } from "../types/workFlowTypes";

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
