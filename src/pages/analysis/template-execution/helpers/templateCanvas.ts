import type { Edge, Node } from "@xyflow/react";
import { buildExecutionCanvas } from "./executionCanvas";

interface workflowData {
  nodes: Node[];
  edges: Edge[];
}

interface ExecutionWorkflow {
  itemId: string;
  workflow: workflowData;
}

const ROW_HEIGHT = 200;

export const buildTemplateCanvas = (
  workflows: ExecutionWorkflow[],
): workflowData => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  workflows.forEach((workflow, index) => {
    const canvas = buildExecutionCanvas(workflow.itemId, workflow.workflow);

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
