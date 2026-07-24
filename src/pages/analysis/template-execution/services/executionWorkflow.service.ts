import type { Edge, Node } from "@xyflow/react";
import workflowData from "../mock/workflow.json";

export interface ExecutionWorkFlow {
  nodes: Node[];
  edges: Edge[];
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
): Promise<ExecutionWorkFlow[]> => {
  // TODO: API Call
  return [workflowData as ExecutionWorkFlow];
};
