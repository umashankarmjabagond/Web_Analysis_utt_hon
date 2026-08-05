import workflowMockData from "../../pages/analysis/template-execution/mock/workflow.mock.json";
import templateWorkflowMockData from "../../pages/analysis/template-execution/mock/templateExecution.mock.json";
import type {
  ExecutionWorkflowResponse,
  TemplateExecutionResponse,
} from "../../types/templateExecution";

// single workflow
export const getExecutionWorkflow = async (
  id: string,
): Promise<ExecutionWorkflowResponse> => {
  console.log("Fetching execution workflow for id:", id);
  // TODO: API Call
  return workflowMockData as ExecutionWorkflowResponse;
};

// template workflow
export const getTemplateExecutionWorkflows = async (
  templateId: string,
): Promise<TemplateExecutionResponse> => {
  console.log(
    "Fetching template execution workflows for template id:",
    templateId,
  );
  // TODO: API Call
  return templateWorkflowMockData as TemplateExecutionResponse;
};
