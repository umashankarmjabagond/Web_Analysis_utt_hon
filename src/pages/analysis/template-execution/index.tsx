import type { TemplateExecutionProps } from "../../../types/templateExecution";
import ExecutionToolbar from "./components/ExecutionToolbar";
import WorkflowCanvas from "./components/WorkflowCanvas";

export default function TemplateExecution({
  plant,
  template,
  itemId,
}: TemplateExecutionProps) {
  return (
    <div className="relative h-full">
      <ExecutionToolbar />
      <WorkflowCanvas templateId={template} itemId={itemId} />
    </div>
  );
}
