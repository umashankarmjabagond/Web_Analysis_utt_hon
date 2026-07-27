import type { Node, NodeProps } from "@xyflow/react";
import { useTemplateExecutionStore } from "../../../../../store/templateExecutionStore";

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
      className="nodrag nopan flex  items-center h-6 w-[137px] pr-6 gap-2"
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <input
        type="checkbox"
        className="nodrag nopan h-4 w-4 rounded-xs border border-app-default-border bg-transparent checked:border-app-action-primary checked:bg-transparent cursor-pointer"
        checked={checked}
        onChange={() => toggleExecution(data.itemId)}
      />
      <span className="text-app-text-primary">{data.itemId}</span>
    </div>
  );
}
