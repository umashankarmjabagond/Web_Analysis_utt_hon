import React, { memo } from "react";

import { Handle, Position } from "@xyflow/react";

import { GitBranch, Plus, type LucideIcon } from "lucide-react";

import { attributeCatalogSections } from "../workflowPanelData ";

import type { WorkflowNodeData } from "../../../types/workFlowTypes";

import { cn } from "../../../utils/utils";

interface BaseNodeProps {
  id: string;
  data: WorkflowNodeData;
}

const catalogIconMap: Record<string, LucideIcon> = {};

for (const section of attributeCatalogSections) {
  for (const item of section.items) {
    if (item.icon) {
      catalogIconMap[item.id] = item.icon;
    }
  }
}

interface NodeIconProps {
  catalogId?: string;
  className: string;
}

function NodeIcon({ catalogId, className }: NodeIconProps) {
  const icon = catalogId ? catalogIconMap[catalogId] : undefined;

  if (!icon) {
    return <GitBranch size={20} strokeWidth={1.8} className={className} />;
  }

  return React.createElement(icon, {
    size: 20,
    strokeWidth: 1.8,
    className,
  });
}

type InsertDirection = "top" | "right" | "bottom" | "left";

interface AddHandleProps {
  position: Position;
  direction: InsertDirection;
  onInsert: (direction: InsertDirection) => void;
  className: string;
}

function AddHandle({
  position,
  direction,
  onInsert,
  className,
}: AddHandleProps) {
  return (
    <Handle
      id={`${direction}-handle`}
      position={position}
      onClick={(event) => {
        event.stopPropagation();
        onInsert(direction);
      }}
      className={cn(
        "!flex",
        "!items-center",
        "!justify-center",
        "!h-[14px]",
        "!w-[14px]",
        "!rounded-full",
        "!border",
        "!border-[#64C3FF]",
        "!bg-[#2E2E2E]",
        "!text-[#64C3FF]",
        "!opacity-0",
        "group-hover:!opacity-100",
        "hover:!bg-[#64C3FF]",
        "hover:!text-black",
        "!transition-colors",
        "!duration-150",
        "!cursor-pointer",
        className,
      )}
    >
      <Plus size={9} strokeWidth={2.5} className="pointer-events-none" />
    </Handle>
  );
}

function BaseNode({ id, data }: BaseNodeProps) {
  const { label, element, catalogId } = data;

  const isDataSink = element?.elementType?.toLowerCase() === "datasink";

  const iconClassName = isDataSink ? "text-[#8A8A8A]" : "text-[#45C95A]";

  const nodeBorderClassName = isDataSink
    ? "border border-[#555555]"
    : "border border-[#36B94A]";

  const labelClassName = isDataSink ? "text-[#8A8A8A]" : "text-[#B8B8B8]";

  const handleInsert = (direction: InsertDirection) => {
    data.onNodeInsert?.({
      nodeId: id,
      direction,
    });
  };

  return (
    <div className="group relative flex flex-col items-center">
      <div
        className={cn(
          "relative flex h-11 w-11 items-center justify-center",
          "rounded-[6px] bg-[#111111]",
          "transition-all duration-150",
          nodeBorderClassName,
        )}
      >
        {/* Top */}
        <AddHandle
          position={Position.Top}
          direction="top"
          onInsert={handleInsert}
          className="!top-0"
        />

        {/* Right */}
        <AddHandle
          position={Position.Right}
          direction="right"
          onInsert={handleInsert}
          className="!right-0"
        />

        {/* Bottom */}
        <AddHandle
          position={Position.Bottom}
          direction="bottom"
          onInsert={handleInsert}
          className="!bottom-0"
        />

        {/* Left */}
        <AddHandle
          position={Position.Left}
          direction="left"
          onInsert={handleInsert}
          className="!left-0"
        />

        <NodeIcon catalogId={catalogId} className={iconClassName} />
      </div>

      <div
        className={cn(
          "mt-1.5 max-w-[100px] whitespace-nowrap",
          "text-center text-[10px] font-normal leading-3",
          labelClassName,
        )}
      >
        {label}
      </div>
    </div>
  );
}

export default memo(BaseNode);
