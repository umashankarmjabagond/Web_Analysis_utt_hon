import type { Edge, Node } from "@xyflow/react";
import workflowData from "../mock/workflow.mock.json";
import templateWorkflowData from "../mock/templateExecution.mock.json";

export interface ExecutionWorkFlow {
  nodes: Node[];
  edges: Edge[];
}

export interface TemplateExecutionWorkflow {
  itemId: string;
  workflow: ExecutionWorkFlow;
}

// signle workflowflow
export const getExecutionWorkflow = async (
  itemId: string,
): Promise<ExecutionWorkFlow> => {
  // TODO: API Call
  return workflowData as ExecutionWorkFlow;
};

// template workflow
export const getTemplateExecutionWorkflows = async (
  templateId: string,
): Promise<TemplateExecutionWorkflow[]> => {
  // TODO: API Call
  return templateWorkflowData.workflows as TemplateExecutionWorkflow[];
};
