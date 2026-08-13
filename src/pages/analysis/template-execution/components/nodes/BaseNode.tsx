import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useTranslation } from "react-i18next";
import { NODE_TYPES } from "./nodeConfig";
import { useTemplateExecutionStore } from "../../../../../store/templateExecutionStore";
import type {
  BaseFlowNode,
  HandleConfig,
  NodeType,
} from "../../../../../types/templateExecution";
import { useWorkflowCanvasInteractions } from "../../../../../hooks/useWorkflowInteractions";
import { Fragment } from "react/jsx-runtime";
import type { CSSProperties } from "react";
import Tooltip from "../../../../../components/common/tooltip/Tooltip";
import Checkbox from "../../../../../components/forms/checkbox/CheckBox";
import { cn } from "../../../../../utils/utils";

export default function BaseNode({ id, data, type }: NodeProps<BaseFlowNode>) {
  const { t } = useTranslation();
  const checked = useTemplateExecutionStore((state) =>
    state.selectedNodeIds.includes(id),
  );

  const { handleNodeSelection } = useWorkflowCanvasInteractions();

  const nodeMeta = NODE_TYPES[type as NodeType];
  if (!nodeMeta) return null;

  const Icon = nodeMeta.icon;

  const nodeStatusStyles = {
    default: {
      background: "bg-node-default-background",
      border: "border-node-default-border",
      tint: "",
    },

    success: {
      background: "bg-node-status-background",
      border: "border-node-success-border",
      tint: "bg-node-success-tint",
    },

    warning: {
      background: "bg-node-status-background",
      border: "border-node-warning-border",
      tint: "bg-node-warning-tint",
    },

    error: {
      background: "bg-node-status-background",
      border: "border-node-error-border",
      tint: "bg-node-error-tint",
    },
  } as const;

  const nodeSelectionStyles = {
    default: {
      border: "border-node-selection-border",
      tint: "bg-node-selection-tint",
    },

    success: {
      border: "border-node-success-selected-border",
      tint: "bg-node-success-selected-tint",
    },

    warning: {
      border: "border-node-selection-border",
      tint: "bg-node-selection-tint",
    },

    error: {
      border: "border-node-selection-border",
      tint: "bg-node-selection-tint",
    },
  } as const;

  const statusStyle = nodeStatusStyles[data.status];
  const selectionStyle = nodeSelectionStyles[data.status];

  const nodeBorder = checked ? selectionStyle.border : statusStyle.border;
  const nodeTint = checked ? selectionStyle.tint : statusStyle.tint;

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

  const nodeStatusMsg =
    data.status === "warning"
      ? t("NODE_WARNING_MESSAGE")
      : data.status === "error"
        ? t("NODE_ERROR_MESSAGE")
        : null;

  return (
    <Tooltip content={nodeStatusMsg} disabled={checked}>
      <div
        className={cn(
          "group nodrag nopan relative min-h-22 w-20 min-w-20 overflow-hidden rounded-[4px] border px-2 py-3 cursor-pointer",
          statusStyle.background,
          nodeBorder,
        )}
      >
        {nodeTint && (
          <div
            className={cn("pointer-events-none absolute inset-0", nodeTint)}
          />
        )}

        <div
          className={`absolute top-1 left-1 z-20 ${
            checked ? "block" : "hidden group-hover:block"
          }`}
        >
          <Checkbox
            checked={checked}
            className="nodrag nopan"
            onClick={(e) => e.stopPropagation()}
            onChange={() => handleNodeSelection(id, data.status)}
          />
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2">
          <Icon size={16} className="shrink-0 text-foreground" />
          <span className="w-full h-10 line-clamp-2 text-center text-sm text-foreground leading-5">
            {t(data.label)}
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
      </div>
    </Tooltip>
  );
}
