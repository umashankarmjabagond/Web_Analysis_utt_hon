import type { Edge, EdgeProps, Node, Position } from "@xyflow/react";
import type { NODE_CONFIG } from "../pages/analysis/template-execution/components/nodes/nodeConfig";

// service types
export type ExecutionFlowNode = BaseFlowNode | ExecutionHeaderFlowNode;
export interface WorkflowData {
  nodes: ExecutionFlowNode[];
  edges: Edge[];
}

export interface ExecutionWorkflowResponse {
  asset: ExecutionItem;
  workflow: WorkflowData;
}

export interface TemplateExecutionWorkflow {
  itemId: string;
  workflow: WorkflowData;
}

export interface TemplateExecutionResponse {
  template: ExecutionItem;
  workflows: TemplateExecutionWorkflow[];
  total: number;
}

// analysis/flowBuilders/templateItemFlowBuilder - custom execustion header node creation
export interface CreateExecutionHeaderNodeProps {
  itemId: string;
  y: number;
}

// analysis template execution nodes types
export type NodeType = keyof typeof NODE_CONFIG;

// analysis template execution nodes status types
export type NodeStatus = "default" | "success" | "warning" | "error";

// base Node
export type BaseNodeData = {
  label: string;
  status: NodeStatus;
};

export type BaseFlowNode = Node<BaseNodeData>;

export type HandleConfig = {
  id: string;
  position: Position;
};

// base edge
export type EdgePathType = "bezier" | "smoothstep" | "straight" | "default";

export type WorkflowEdgeData = {
  pathType: EdgePathType;
  animated?: boolean;
};

export type WorkflowEdge = Edge<WorkflowEdgeData, "workflow">;
export type ExecutionWorkflowEdgeProps = EdgeProps<WorkflowEdge>;

// edge geometry
export type HandleCoordinates = {
  x: number;
  y: number;
  position: Position;
};

export type LayoutEdge = {
  source: string;
  target: string;
  sourceHandle: string | null | undefined;
  targetHandle: string | null | undefined;
  pathType: EdgePathType;
};

export type EdgePathResult = {
  path: string;
  labelX: number;
  labelY: number;
  offsetX: number;
  offsetY: number;
};

export type GetHandleCoordinatesParams = {
  nodeX: number;
  nodeY: number;
  nodeWidth: number;
  nodeIconHeight: number;
  handleId: string | null | undefined;
};

export type GetEdgePathParams = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
};

// layout / bounds
export type Bounds = {
  minX: number;
  minY: number;
  width: number;
  height: number;
};

export type PathBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PositionedNodeBounds = {
  id: string;
  x: number;
  y: number;
  width: number;
  iconHeight: number;
  visualHeight: number;
};

export type ExecutionRowBoundary = {
  width: number;
  height: number;
};

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

export const EXECUTION_VIEW_MODE = {
  COMPACT: "compact",
  COMFORTABLE: "comfortable",
};

export type ExecutionViewMode =
  (typeof EXECUTION_VIEW_MODE)[keyof typeof EXECUTION_VIEW_MODE];

// analysis template
export interface TemplateExecutionProps {
  plant: string;
  template: string;
  itemId?: string;
}

// execution store
export const EXECUTION_ACTION = {
  IDLE: "idle",
  EXECUTE: "execute",
  PAUSE: "pause",
  DELETE: "delete",
} as const;

export type ExecutionItemType = "unit" | "asset";
export type ExecutionAction =
  (typeof EXECUTION_ACTION)[keyof typeof EXECUTION_ACTION];

export type NodeExecutionStatus =
  | "not-started"
  | "pending"
  | "in-progress"
  | "completed";

export interface ExecutionItem {
  id: string;
  name: string;
  type: ExecutionItemType;
}

// analysis template -  workflow canvas
export interface WorkflowCanvasProps {
  executionContext: ExecutionItemType;
  loadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
}
