import { useLoadExecutionWorkflow } from "../../../hooks/useLoadExecutionWorkflow";
import type { TemplateExecutionProps } from "../../../types/templateExecution";
import ExecutionToolbar from "./components/ExecutionToolbar";
import WorkflowCanvas from "./components/WorkflowCanvas";

export default function TemplateExecution({
  plant,
  template,
  itemId,
}: TemplateExecutionProps) {
  useLoadExecutionWorkflow(template, itemId);
  return (
    <div className="relative h-full">
      <ExecutionToolbar />
      <WorkflowCanvas />
    </div>
  );
}
