import workflowMockData from "../../pages/analysis/template-execution/mock/workflow.mock.json";
import templateWorkflowMockData from "../../pages/analysis/template-execution/mock/templateExecution.mock.json";
import type {
  ExecutionWorkflowResponse,
  TemplateExecutionResponse,
} from "../../types/templateExecution";
import { generateTemplateExecutionMock } from "../../pages/analysis/template-execution/mock/templateExecutionGenerator";

export interface PaginationParams {
  offset: number;
  limit: number;
}

// Simulates a large dataset
const MOCK_TOTAL_ROWS = 1000;
const mockDataset = generateTemplateExecutionMock(MOCK_TOTAL_ROWS);

// single workflow
export const getExecutionWorkflow = async (
  id: string,
): Promise<ExecutionWorkflowResponse> => {
  console.log("Fetching execution workflow for id:", id);
  // TODO: API Call
  return workflowMockData as ExecutionWorkflowResponse;
};

//dummy delay to test loader
const simulateDelay = (ms = 3000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// template workflow
export const getTemplateExecutionWorkflows = async (
  templateId: string,
  { offset, limit }: PaginationParams,
): Promise<TemplateExecutionResponse> => {
  console.log(
    `Fetching template workflows: ${templateId}, offset ${offset}, limit ${limit}`,
  );

  await simulateDelay();

  // TODO: API Call
  const slice = mockDataset.workflows.slice(offset, offset + limit);

  return {
    template: mockDataset.template,
    workflows: slice,
    total: mockDataset.workflows.length,
  } as TemplateExecutionResponse;
};
