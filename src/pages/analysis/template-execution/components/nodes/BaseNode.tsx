import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useTranslation } from "react-i18next";
import { NODE_TYPES } from "./nodeConfig";
import type {
  BaseFlowNode,
  HandleConfig,
  NodeType,
} from "../../../../../types/templateExecution";
import { Fragment } from "react/jsx-runtime";
import type { CSSProperties } from "react";
import { cn } from "../../../../../utils/utils";

export default function BaseNode({ id, data, type }: NodeProps<BaseFlowNode>) {
  const { t } = useTranslation();

  const nodeMeta = NODE_TYPES[type as NodeType];
  if (!nodeMeta) return null;

  const Icon = nodeMeta.icon;

  const nodeStatusStyles = {
    default: {
      background: "bg-[#2E2E2E]",
      border: "border-[#454545]",
      icon: "text-[#909090]",
    },

    success: {
      background: "bg-[#0A150A]",
      border: "border-[#68D560]",
      icon: "text-[#68D560]",
    },

    warning: {
      background: "bg-[#FF96401A]",
      border: "border-[#FF9640]",
      icon: "text-[#FF9640]",
    },

    error: {
      background: "bg-[#FF52471A]",
      border: "border-[#FF5247]",
      icon: "text-[#FF5247]",
    },
  } as const;

  const statusStyle = nodeStatusStyles[data.status];

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
    <div className="flex flex-col gap-2">
      <div
        data-testid="node"
        className={cn(
          "nodrag nopan relative flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border-[1.5px]",
          statusStyle.background,
          statusStyle.border,
        )}
      >
        <Icon size={13} className={cn("shrink-0", statusStyle.icon)} />

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
      <span className="w-max text-center text-[12px] leading-[15px] font-medium text-foreground">
        {t(data.label)}
      </span>
    </div>
  );
}
