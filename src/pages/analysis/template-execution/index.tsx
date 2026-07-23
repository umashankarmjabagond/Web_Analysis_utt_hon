import ExecutionToolbar from "./components/ExecutionToolbar";
import WorkflowCanvas from "./components/WorkflowCanvas";

interface TemplateExecutionProps {
  plant: string;
  template: string;
  itemId?: string;
}
export default function TemplateExecution({
  plant,
  template,
  itemId,
}: TemplateExecutionProps) {
  return (
    <div className="relative h-full">
      <ExecutionToolbar />
      <WorkflowCanvas />
    </div>
  );
}
