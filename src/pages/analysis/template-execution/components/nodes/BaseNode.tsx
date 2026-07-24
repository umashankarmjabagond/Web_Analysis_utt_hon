import { Handle, Position } from "@xyflow/react";
import { NODE_TYPES } from "./nodeConfig";

export interface BaseNodeDataProps {
  data: {
    label: string;
  };
  type: string;
}

export default function BaseNode({ data, type }: BaseNodeDataProps) {
  const nodeMeta = NODE_TYPES.find((item) => item.type === type);
  if (!nodeMeta) return null;
  const Icon = nodeMeta?.icon;

  return (
    <div className="rounded-lg border border-slate-300 bg-white shadow-sm min-w-30 overflow-hidden">
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: 8,
          height: 8,
          background: "#E5E5E5",
          border: "2px solid #555",
        }}
      />

      <div className="rounded-lg px-4 py-3 text-sm font-medium border flex flex-col items-center gap-2 border-amber-500">
        <Icon size={16} className="shrink-0" />
        <span>{data.label}</span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: 8,
          height: 8,
          background: "#E5E5E5",
          border: "2px solid #555",
        }}
      />
    </div>
  );
}
