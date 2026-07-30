import workflowMockData from "../../pages/analysis/template-execution/mock/workflow.mock.json";
import templateWorkflowMockData from "../../pages/analysis/template-execution/mock/templateExecution.mock.json";
import type {
  ExexutionWorkflowResponse,
  TemplateExecutionResponse,
} from "../../types/templateExecution";

// signle workflowflow
export const getExecutionWorkflow = async (
  itemId: string,
): Promise<ExexutionWorkflowResponse> => {
  // TODO: API Call
  return workflowMockData as ExexutionWorkflowResponse;
};

// template workflow
export const getTemplateExecutionWorkflows = async (
  templateId: string,
): Promise<TemplateExecutionResponse> => {
  // TODO: API Call
  return templateWorkflowMockData as TemplateExecutionResponse;
};
