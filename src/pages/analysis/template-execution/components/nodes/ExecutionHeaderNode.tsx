import type { NodeProps } from "@xyflow/react";
import { useTemplateExecutionStore } from "../../../../../store/templateExecutionStore";
import type { ExecutionHeaderFlowNode } from "../../../../../types/templateExecution";
import Checkbox from "../../../../../components/forms/checkbox/CheckBox";

export default function ExecutionHeaderNode({
  data,
}: NodeProps<ExecutionHeaderFlowNode>) {
  const checked = useTemplateExecutionStore((state) =>
    state.selectedRowIds.includes(data.itemId),
  );

  const toggleSelectedRow = useTemplateExecutionStore(
    (state) => state.toggleSelectedRow,
  );

  return (
    <div className="nodrag nopan flex  items-center h-6 w-[137px] pr-6 gap-2 shrink-0">
      <Checkbox
        checked={checked}
        className="nodrag nopan"
        onClick={(e) => e.stopPropagation()}
        onChange={() => toggleSelectedRow(data.itemId)}
      />
      <span className="text-foreground">{data.itemId}</span>
    </div>
  );
}
