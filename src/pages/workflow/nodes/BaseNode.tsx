import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

import type { WorkflowNodeData } from "../../../types/workFlowTypes";

interface BaseNodeProps {
  data: WorkflowNodeData;
}

function BaseNode({ data }: BaseNodeProps) {
  const { label, element } = data;

  return (
    <div className="group relative min-w-[120px] rounded-md border border-node-default-border bg-node-default-background shadow-md transition-all duration-200  hover:border-node-hover-border">
      <div className="pointer-events-none absolute inset-0 bg-node-hover-background opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      {/* Target Handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: 12,
          height: 12,
          left: 0,
          background: "transparent",
          border: "none",
          opacity: 0,
        }}
      />

      <div className="flex flex-col items-center px-3 py-2">
        <div className="text-sm text-foreground">📄</div>

        <div className="mt-1 text-center text-sm font-medium text-foreground">
          {label}
        </div>

        <div className="mt-1 text-[10px] uppercase tracking-wider text-foreground-secondary">
          {element.elementType}
        </div>
      </div>

      {/* Source Handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: 12,
          height: 12,
          background: "var(--handle-background)",
          border: "3px solid var(--handle-border)",
        }}
      />
    </div>
  );
}

export default memo(BaseNode);
