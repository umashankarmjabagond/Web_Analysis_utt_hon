import type { NodeProps } from "@xyflow/react";
import Checkbox from "../../../../../components/forms/checkbox/CheckBox";
import { useTemplateExecutionStore } from "../../../../../store/templateExecutionStore";
import type { ExecutionHeaderFlowNode } from "../../../../../types/templateExecution";
import { cn } from "../../../../../utils/utils";

export default function ExecutionRowNode({
  data,
}: NodeProps<ExecutionHeaderFlowNode>) {
  const checked = useTemplateExecutionStore((state) =>
    state.selectedRowIds.includes(data.itemId),
  );

  const toggleSelectedRow = useTemplateExecutionStore(
    (state) => state.toggleSelectedRow,
  );

  return (
    <div
      className={cn(
        "nodrag nopan flex h-full w-full items-start py-1.5 px-3 gap-3 rounded-[8px] border",
        checked
          ? "border-[#4FB3FF] bg-[#4FB3FF29]"
          : "border-[#454545] bg-[#1B1B1B]",
      )}
    >
      <Checkbox
        checked={checked}
        className="nodrag nopan"
        onClick={(e) => e.stopPropagation()}
        onChange={() => toggleSelectedRow(data.itemId)}
      />
    </div>
  );
}
