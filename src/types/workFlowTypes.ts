import type { MouseEventHandler } from "react";
import WorkflowEdge from "../pages/workflow/edges/BaseEdge";
import BaseNode from "../pages/workflow/nodes/BaseNode";

import type { Edge, Node, Viewport } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";

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

export interface WorkflowCanvasData {
  nodes: WorkflowNode[];

  edges: WorkflowEdge[];

  viewport?: Viewport;
}

export type WorkflowEdge = Edge;

export type DragItemType = "template" | "attribute";

export interface WorkflowDragItem {
  type: DragItemType;

  item: WorkflowListItem;
}

export interface BackendWorkflow {
  LoopName: string;

  TemplateName: string;

  AnalysisName: string;

  Location: string;

  Description: string;

  HistorianFile: string;

  settings: Record<string, unknown>;

  thresholds: Record<string, unknown>;

  Elements: BackendElement[];
}

export interface BackendElement {
  elementType: string;

  Name: string;

  ParentNames: string[] | null;

  tagMap?: Record<string, unknown>;

  ConnectedAttributes?: Record<string, unknown>;

  ExpressionMap?: Record<string, unknown>;

  properties?: Record<string, unknown>;

  paProperties?: Record<string, unknown>;
}

export interface WorkflowListItem {
  id: string;
  title: string;
  description?: string;
  element: BackendElement;
  icon?: LucideIcon;
}

export interface WorkflowSection {
  id?: string;
  title: string;
  items: WorkflowListItem[];
}

export interface WorkflowNodeData extends Record<string, unknown> {
  label: string;
  element: BackendElement;
}

export type WorkflowNode = Node<WorkflowNodeData>;
export interface KpiItem {
  name: string;
  value: string | number;
}

export interface CalculatedKpisAndErrorsProps {
  kpis?: KpiItem[];
  errors?: string[];
}

export interface ToolbarButtonProps {
  icon: LucideIcon;
  title: string;
  active?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export interface PropertiesProps {
  onCancel?: () => void;
}
