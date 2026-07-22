import WorkflowEdge from "../pages/workflow/edges/BaseEdge";
import BaseNode from "../pages/workflow/nodes/BaseNode";
import type { XYPosition } from "@xyflow/react";

export const edgeTypes = {
  workflow: WorkflowEdge,
};

export const nodeTypes = {
  baseNode: BaseNode,
};

export interface WorkflowTemplate {
  id?: string;

  name: string;

  description?: string;

  version?: number;

  nodes: WorkflowNode[];

  edges: WorkflowEdge[];
}

export interface WorkflowNode {
  id: string;

  type: string;

  position: XYPosition;

  data: WorkflowNodeData;
}

export interface WorkflowNodeData {
  label: string;

  config?: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;

  source: string;

  target: string;
}
