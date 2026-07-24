import type { Edge, Node } from "@xyflow/react";

interface CreateExecutionHeaderNodeProps {
  itemId: string;
  y?: number;
}

interface FlowData {
  nodes: Node[];
  edges: Edge[];
}

export const createExecutionHeaderNode = ({
  itemId,
  y = 178,
}: CreateExecutionHeaderNodeProps): Node => ({
  id: `execution-header-${itemId}`,
  type: "executionHeader",
  position: {
    x: 0,
    y,
  },
  draggable: false,
  selectable: true,
  data: {
    itemId,
  },
});

export const buildCanvasData = (
  itemId: string,
  flowData: FlowData,
): FlowData => {
  const firstNode = flowData.nodes[0];

  const headerHeight = 20;
  const nodeHeight = firstNode.measured?.height ?? 72;

  // calculate checkbox center position
  const centeredY = firstNode.position.y + (nodeHeight - headerHeight) / 2;

  return {
    nodes: [
      createExecutionHeaderNode({
        itemId,
        y: centeredY,
      }),
      ...flowData.nodes,
    ],
    edges: flowData.edges,
  };
};
