import { MarkerType } from "@xyflow/react";

import type { Edge, Node } from "@xyflow/react";
import type {
  WorkflowEdge,
  WorkflowNode,
  WorkflowTemplate,
} from "../../types/workFlowTypes";

export const toWorkflowTemplate = (
  name: string,
  nodes: Node[],
  edges: Edge[],
): WorkflowTemplate => {
  return {
    name,

    nodes: nodes.map(mapNode),

    edges: edges.map(mapEdge),
  };
};

export const fromWorkflowTemplate = (template: WorkflowTemplate) => {
  return {
    nodes: template.nodes.map(mapNodeToReactFlow),

    edges: template.edges.map(mapEdgeToReactFlow),
  };
};

const mapNode = (node: Node): WorkflowNode => ({
  id: node.id,

  type: node.type ?? "",

  position: {
    x: node.position.x,

    y: node.position.y,
  },

  data: {
    label: String(node.data.label),

    config: (node.data as { config?: Record<string, unknown> }).config ?? {},
  },
});

const mapEdge = (edge: Edge): WorkflowEdge => ({
  id: edge.id,

  source: edge.source,

  target: edge.target,
});

const mapNodeToReactFlow = (node: WorkflowNode): Node => ({
  id: node.id,

  type: node.type,

  position: node.position,

  data: node.data,
});

const mapEdgeToReactFlow = (edge: WorkflowEdge): Edge => ({
  id: edge.id,

  source: edge.source,

  target: edge.target,

  type: "workflow",

  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
});
