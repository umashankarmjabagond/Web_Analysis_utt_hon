import WorkflowEdge from "../pages/workflow/edges/BaseEdge";
import BaseNode from "../pages/workflow/nodes/BaseNode";

import type { Edge, Node, Viewport } from "@xyflow/react";

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

  nodes: Node[];
  edges: Edge[];
}

export interface WorkflowCanvasData {
  nodes: Node[];
  edges: Edge[];
  viewport?: Viewport;
}

export interface WorkflowListItem {
  id: string;
  title: string;
}

export interface WorkflowSection {
  title: string;
  items: WorkflowListItem[];
}


export interface KpiItem {
  name: string;
  value: string | number;
}

export interface CaluclatedKpisAndErrorsProps {
  kpis?: KpiItem[];
  errors?: string[];
}