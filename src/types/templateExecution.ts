import type { Edge, Node } from "@xyflow/react";
import type { NODE_TYPES } from "../pages/analysis/template-execution/components/nodes/nodeConfig";

// service types
export interface WorkflowData {
  nodes: Node[];
  edges: Edge[];
}

export interface ExexutionWorkflowResponse {
  asset: {
    id: string;
    name: string;
    type: string;
  };
  workflow: WorkflowData;
}

export interface TemplateExecutionWorkflow {
  itemId: string;
  workflow: WorkflowData;
}

export interface TemplateExecutionResponse {
  template: {
    id: string;
    name: string;
    type: string;
  };
  workflows: TemplateExecutionWorkflow[];
}

// analysis/flowBuilders/templateItemFlowBuilder - custom execustion header node creation
export interface CreateExecutionHeaderNodeProps {
  itemId: string;
  y?: number;
}

// analysis template execution nodes types
export type NodeType = keyof typeof NODE_TYPES;

// analysis template execution nodes status types
export type NodeStatus = "default" | "success" | "warning" | "error";

// base Node
export type BaseNodeData = {
  label: string;
  status: NodeStatus;
};

export type BaseFlowNode = Node<BaseNodeData>;

// execution header node
type ExecutionHeaderData = {
  itemId: string;
};

export type ExecutionHeaderFlowNode = Node<ExecutionHeaderData>;

// execution tool bar
export interface ToolbarButtonProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

// analysis template -  workflow canvas
export interface WorkflowCanvasProps {
  templateId: string;
  itemId: string;
}

// analysis template
export interface TemplateExecutionProps {
  plant: string;
  template: string;
  itemId?: string;
}
