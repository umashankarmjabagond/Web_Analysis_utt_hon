import workflowMockData from "../../pages/analysis/template-execution/mock/workflow.mock.json";
import templateWorkflowData from "../../pages/analysis/template-execution/mock/templateExecution.mock.json";
import type {
  TemplateExecutionWorkflow,
  WorkflowData,
} from "../../types/templateExecution";

// signle workflowflow
export const getExecutionWorkflow = async (
  itemId: string,
): Promise<WorkflowData> => {
  // TODO: API Call
  return workflowMockData as WorkflowData;
};

// template workflow
export const getTemplateExecutionWorkflows = async (
  templateId: string,
): Promise<TemplateExecutionWorkflow[]> => {
  // TODO: API Call
  return templateWorkflowData.workflows as TemplateExecutionWorkflow[];
};
