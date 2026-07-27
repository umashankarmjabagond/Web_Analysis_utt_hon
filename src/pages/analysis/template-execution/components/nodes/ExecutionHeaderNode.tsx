import type { Node, NodeProps } from "@xyflow/react";
import { useTemplateExecutionStore } from "../../../../../store/templateExecutionStore";
import { Check } from "lucide-react";

type ExecutionHeaderData = {
  itemId: string;
};

type ExecutionHeaderFlowNode = Node<ExecutionHeaderData>;

export default function ExecutionHeaderNode({
  data,
}: NodeProps<ExecutionHeaderFlowNode>) {
  const checked = useTemplateExecutionStore((state) =>
    state.selectedExecutionIds.includes(data.itemId),
  );

  const toggleExecution = useTemplateExecutionStore(
    (state) => state.toggleExecution,
  );

  return (
    <div
      className="nodrag nopan flex  items-center h-6 w-[137px] pr-6 gap-2 shrink-0"
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="relative h-4 w-4 flex items-center justify-center shrink-0">
        <input
          type="checkbox"
          className="nodrag nopan appearance-none peer h-4 w-4 rounded-xs border border-app-default-border bg-transparent checked:border-app-action-primary checked:bg-app-action-primary cursor-pointer"
          checked={checked}
          onChange={() => toggleExecution(data.itemId)}
        />
        <Check
          className="pointer-events-none absolute h-3 w-3 text-black opacity-0 peer-checked:opacity-100"
          strokeWidth={3}
        />
      </div>
      <span className="text-app-text-primary">{data.itemId}</span>
    </div>
  );
}
