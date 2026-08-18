import type { Edge } from "@xyflow/react";
import { buildTemplateItemFlow } from "./templateItemFlowBuilder";
import type {
  ExecutionFlowNode,
  TemplateExecutionWorkflow,
  WorkflowData,
} from "../../../../types/templateExecution";

const ROW_HEIGHT = 200;

export const buildTemplateCanvas = (
  workflows: TemplateExecutionWorkflow[],
  startIndex = 0,
): WorkflowData => {
  const nodes: ExecutionFlowNode[] = [];
  const edges: Edge[] = [];

  const PREPEND_HEADER = true;

  workflows.forEach((workflow, i) => {
    const globalIndex = startIndex + i;

    const canvas = buildTemplateItemFlow(
      workflow.itemId,
      workflow.workflow,
      PREPEND_HEADER,
    );

    const shiftedNodes = shiftNodes(canvas.nodes, globalIndex * ROW_HEIGHT);

    nodes.push(...shiftedNodes);
    edges.push(...canvas.edges);
  });

  return {
    nodes,
    edges,
  };
};

const shiftNodes = (
  nodes: ExecutionFlowNode[],
  offsetY: number,
): ExecutionFlowNode[] =>
  nodes.map((node) => ({
    ...node,
    position: {
      ...node.position,
      y: node.position.y + offsetY,
    },
  }));
