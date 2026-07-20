import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

interface BaseNodeProps {
  data: {
    label: string;
  };
}

function BaseNode({ data }: BaseNodeProps) {
  return (
    <div className="group relative w-20 rounded-md border border-[#555] bg-[#2B2B2B] shadow-md transition-all duration-200 hover:border-[#7aa2ff]">
      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border-2 !border-white !bg-[#6c8cff]
                   opacity-0 group-hover:opacity-100 transition"
      />

      <div className="flex flex-col items-center justify-center py-1">
        <div className="text-sm">📄</div>

        <div className="text-sm text-white tracking-wide">{data.label}</div>
      </div>

      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border-2 !border-white !bg-[#32d74b]
                   opacity-0 group-hover:opacity-100 transition"
      />
    </div>
  );
}

export default memo(BaseNode);
