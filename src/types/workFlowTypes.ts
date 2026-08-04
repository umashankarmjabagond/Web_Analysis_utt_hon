import WorkflowEdge from "../pages/workflow/edges/BaseEdge";
import BaseNode from "../pages/workflow/nodes/BaseNode";

import type { Edge, Node, Viewport } from "@xyflow/react";

export const edgeTypes = {
  workflow: WorkflowEdge,
};

export const nodeTypes = {
  baseNode: BaseNode,
};

/* -------------------------------------------------------------------------- */
/*                               React Flow Types                             */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                               Drag & Drop Types                            */
/* -------------------------------------------------------------------------- */

export type DragItemType = "template" | "attribute";

export interface WorkflowDragItem {
  type: DragItemType;

  item: WorkflowListItem;
}

/* -------------------------------------------------------------------------- */
/*                            Backend Workflow Types                          */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                             Workflow Panel Types                           */
/* -------------------------------------------------------------------------- */

export interface WorkflowListItem {
  id: string;

  title: string;

  /**
   * Optional description shown in dialogs/search.
   */
  description?: string;

  /**
   * Backend element represented by this catalog item.
   * For templates this is only metadata.
   * For attributes this is the node to create.
   */
  element: BackendElement;
}

export interface WorkflowSection {
  id?: string;
  title: string;
  items: WorkflowListItem[];
}

/* -------------------------------------------------------------------------- */
/*                             React Flow Node Data                           */
/* -------------------------------------------------------------------------- */

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
