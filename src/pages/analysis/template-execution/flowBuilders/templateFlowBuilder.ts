import type { Edge, Node } from "@xyflow/react";
import { buildTemplateItemFlow } from "./templateItemFlowBuilder";
import type {
  TemplateExecutionWorkflow,
  WorkflowData,
} from "../../../../types/templateExecution";

const ROW_HEIGHT = 200;

export const buildTemplateCanvas = (
  workflows: TemplateExecutionWorkflow[],
): WorkflowData => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const PREPEND_HEADER = true;

  workflows.forEach((workflow, index) => {
    const canvas = buildTemplateItemFlow(
      workflow.itemId,
      workflow.workflow,
      PREPEND_HEADER,
    );

    const shiftedNodes = shiftNodes(canvas.nodes, index * ROW_HEIGHT);

    nodes.push(...shiftedNodes);
    edges.push(...canvas.edges);
  });

  return {
    nodes,
    edges,
  };
};

const shiftNodes = (nodes: Node[], offsetY: number): Node[] =>
  nodes.map((node) => ({
    ...node,
    position: {
      ...node.position,
      y: node.position.y + offsetY,
    },
  }));
