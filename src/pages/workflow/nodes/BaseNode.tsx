import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

interface BaseNodeProps {
  data: {
    label: string;
  };
}

function BaseNode({ data }: BaseNodeProps) {
  return (
    <div className="relative w-24 rounded-md border border-[#555] bg-[#2B2B2B] shadow-md transition-all duration-200 hover:border-[#7aa2ff]">
      {/* Left Handle (Invisible but Connectable) */}
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

      <div className="flex flex-col items-center justify-center py-2">
        <div className="text-sm">📄</div>

        <div className="px-2 text-center text-sm tracking-wide text-white">
          {data.label}
        </div>
      </div>

      {/* Right Handle (Always Visible like Honeywell) */}
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
