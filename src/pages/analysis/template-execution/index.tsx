import { useLoadExecutionWorkflow } from "../../../hooks/useLoadExecutionWorkflow";
import type { TemplateExecutionProps } from "../../../types/templateExecution";
import ExecutionToolbar from "./components/ExecutionToolbar";
import WorkflowCanvas from "./components/WorkflowCanvas";

export default function TemplateExecution({
  // plant,
  template,
  itemId,
}: TemplateExecutionProps) {
  const executionContext = itemId ? "asset" : "unit";
  const { loadMore, hasMore, isLoadingMore } = useLoadExecutionWorkflow(
    template,
    itemId,
  );
  return (
    <div className="relative h-full">
      <ExecutionToolbar />
      <WorkflowCanvas
        executionContext={executionContext}
        loadMore={loadMore}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
      />
    </div>
  );
}
