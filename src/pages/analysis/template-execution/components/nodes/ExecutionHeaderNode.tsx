import type { NodeProps } from "@xyflow/react";
import type { ExecutionHeaderFlowNode } from "../../../../../types/templateExecution";

export default function ExecutionHeaderNode({
  data,
}: NodeProps<ExecutionHeaderFlowNode>) {
  return (
    <div className="nodrag nopan flex items-center h-6 w-[137px] pr-6 gap-2 shrink-0">
      <span className="text-foreground">{data.itemId}</span>
    </div>
  );
}
