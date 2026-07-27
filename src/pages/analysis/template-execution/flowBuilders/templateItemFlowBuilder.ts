import type { Node } from "@xyflow/react";
import type {
  CreateExecutionHeaderNodeProps,
  WorkflowData,
} from "../../../../types/templateExecution";

const LEFT_PADDING = 24;
const EXECUTION_HEADER_WIDTH = 100;

export const createTemplateItemHeaderNode = ({
  itemId,
  y = 178,
}: CreateExecutionHeaderNodeProps): Node => ({
  id: `execution-header-${itemId}`,
  type: "executionHeader",
  position: {
    x: LEFT_PADDING,
    y,
  },
  draggable: false,
  selectable: true,
  data: {
    itemId,
  },
});

export const buildTemplateItemFlow = (
  itemId: string,
  flowData: WorkflowData,
): WorkflowData => {
  const firstNode = flowData.nodes[0];

  const nodeHeight = firstNode.measured?.height ?? 72;

  // calculate checkbox center position
  const centeredY = firstNode.position.y + nodeHeight / 2;

  const shiftedNodes = flowData.nodes.map((node) => ({
    ...node,
    position: {
      ...node.position,
      x: node.position.x + LEFT_PADDING + EXECUTION_HEADER_WIDTH,
    },
  }));

  return {
    nodes: [
      createTemplateItemHeaderNode({
        itemId,
        y: centeredY,
      }),
      ...shiftedNodes,
    ],
    edges: flowData.edges,
  };
};
