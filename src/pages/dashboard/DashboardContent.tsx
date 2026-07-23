import { useParams } from "react-router-dom";
import Dashboard from "./Dashboard";
import TemplateExecution from "../analysis/template-execution";

export default function DashboardContent() {
  const { plant, template, itemId } = useParams();

  let content;

  if (!template) {
    content = <Dashboard />;
  } else {
    content = (
      <TemplateExecution plant={plant!} template={template} itemId={itemId} />
    );
  }

  return <>{content}</>;
}
