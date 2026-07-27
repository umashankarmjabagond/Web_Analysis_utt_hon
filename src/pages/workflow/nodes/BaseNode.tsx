import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

import type { WorkflowNodeData } from "../../../types/workFlowTypes";

interface BaseNodeProps {
  data: WorkflowNodeData;
}

function BaseNode({ data }: BaseNodeProps) {
  const { label, element } = data;

  return (
    <div className="relative min-w-[120px] rounded-md border border-[#555] bg-[#2B2B2B] shadow-md transition-all duration-200 hover:border-[#7aa2ff]">
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
        <div className="text-sm">📄</div>

        <div className="mt-1 text-center text-sm font-medium text-white">
          {label}
        </div>

        <div className="mt-1 text-[10px] uppercase tracking-wider text-gray-400">
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
          background: "#E5E5E5",
          border: "2px solid #555",
        }}
      />
    </div>
  );
}

export default memo(BaseNode);
