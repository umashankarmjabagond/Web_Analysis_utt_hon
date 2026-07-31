import { Handle, Position, type NodeProps } from "@xyflow/react";
import { NODE_TYPES } from "./nodeConfig";
import { useTemplateExecutionStore } from "../../../../../store/templateExecutionStore";
import { Check } from "lucide-react";
import type {
  BaseFlowNode,
  NodeType,
} from "../../../../../types/templateExecution";
import { useWorkflowCanvasInteractions } from "../../../../../hooks/useWorkflowInteractions";
import { Fragment } from "react/jsx-runtime";
import type { CSSProperties } from "react";

export default function BaseNode({ id, data, type }: NodeProps<BaseFlowNode>) {
  const checked = useTemplateExecutionStore((state) =>
    state.selectedNodeIds.includes(id),
  );

  const { handleNodeSelection } = useWorkflowCanvasInteractions();

  const nodeMeta = NODE_TYPES[type as NodeType];
  if (!nodeMeta) return null;

  const Icon = nodeMeta.icon;

  const nodeStatusStyles = {
    default: {
      background: "bg-app-default-node",
      border: "border-app-divider",
      tint: "",
    },
    success: {
      background: "bg-app-node-success-background",
      border: "border-app-node-success-border",
      tint: "bg-app-node-success-tint",
    },
    warning: {
      background: "bg-app-node-warning-background",
      border: "border-app-node-warning-border",
      tint: "bg-app-node-warning-tint",
    },
    error: {
      background: "bg-app-node-error-background",
      border: "border-app-node-error-border",
      tint: "bg-app-node-error-tint",
    },
  } as const;

  const nodeSelectionStyles = {
    default: {
      border: "border-app-node-selection-border",
      tint: "bg-app-node-selection-tint",
    },
    success: {
      border: "border-app-node-selection-success-border",
      tint: "bg-app-node-selection-success-tint",
    },
    warning: {
      border: "border-app-node-selection-border",
      tint: "bg-app-node-selection-tint",
    },
    error: {
      border: "border-app-node-selection-border",
      tint: "bg-app-node-selection-tint",
    },
  } as const;

  const statusStyle = nodeStatusStyles[data.status];
  const selectionStyle = nodeSelectionStyles[data.status];

  const nodeStyle = {
    background: statusStyle.background,
    border: checked ? selectionStyle.border : statusStyle.border,
    tint: checked ? selectionStyle.tint : statusStyle.tint,
  };

  type HandleConfig = {
    id: string;
    position: Position;
  };

  const HANDLE_CONFIG: HandleConfig[] = [
    { id: "top", position: Position.Top },
    { id: "right", position: Position.Right },
    { id: "bottom", position: Position.Bottom },
    { id: "left", position: Position.Left },
  ];

  const handleStyle: CSSProperties = {
    visibility: "hidden",
    opacity: 0,
    pointerEvents: "none",
  };

  return (
    <div
      className={`group nodrag nopan relative w-20 min-w-20 min-h-22 rounded-[4px] px-2 py-3 overflow-hidden border cursor-pointer ${nodeStyle.background} ${nodeStyle.border}`}
    >
      {nodeStyle.tint && (
        <div
          className={`absolute inset-0 pointer-events-none ${nodeStyle.tint}`}
        />
      )}

      <div
        className={`absolute top-1 left-1 z-20 ${
          checked ? "block" : "hidden group-hover:block"
        }`}
      >
        <div className="relative h-4 w-4 flex items-center justify-center">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => handleNodeSelection(id, data.status)}
            onClick={(e) => e.stopPropagation()}
            className="nodrag nopan peer h-4 w-4 appearance-none rounded-xs border border-app-default-border bg-transparent checked:border-app-action-primary checked:bg-app-action-primary cursor-pointer"
          />

          <Check
            className="pointer-events-none absolute h-3 w-3 text-black opacity-0 peer-checked:opacity-100"
            strokeWidth={3}
          />
        </div>
      </div>

      {/* Target Handles */}
      {/* <Handle
        type="target"
        position={Position.Left}
        style={{
          visibility: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      <Handle
        type="target"
        position={Position.Top}
        style={{
          visibility: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      /> */}

      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2">
        <Icon size={16} className="shrink-0 text-app-text-secondary" />
        <span className="w-full h-10 line-clamp-2 text-center text-sm text-app-action-secondary leading-5">
          {data.label}
        </span>
      </div>

      {HANDLE_CONFIG.map((handle) => (
        <Fragment key={handle.id}>
          <Handle
            id={handle.id}
            type="target"
            position={handle.position}
            style={handleStyle}
          />

          <Handle
            id={handle.id}
            type="source"
            position={handle.position}
            style={handleStyle}
          />
        </Fragment>
      ))}

      {/* Source Handles */}
      {/* <Handle
        type="source"
        position={Position.Right}
        style={{
          visibility: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          visibility: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      /> */}
    </div>
  );
}
