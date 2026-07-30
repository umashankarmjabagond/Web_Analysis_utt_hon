import type {
  CreateExecutionHeaderNodeProps,
  ExecutionFlowNode,
  WorkflowData,
} from "../../../../types/templateExecution";

const LAYOUT = {
  leftPadding: 24,
  headerWidth: 160,
  topPadding: 140,
};

export const createTemplateItemHeaderNode = ({
  itemId,
  y = 178,
}: CreateExecutionHeaderNodeProps): ExecutionFlowNode => ({
  id: `execution-header-${itemId}`,
  type: "executionHeader",
  position: {
    x: LAYOUT.leftPadding,
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
  prependHeader = false,
): WorkflowData => {
  const workFlowOrigin = {
    x: prependHeader
      ? LAYOUT.leftPadding + LAYOUT.headerWidth
      : LAYOUT.leftPadding,
    y: LAYOUT.topPadding,
  };

  const positionedFlow = positionWorkflow(flowData, workFlowOrigin);

  if (!prependHeader) {
    return positionedFlow;
  }

  return prependExecutionHeader(itemId, positionedFlow);
};

const positionWorkflow = (
  flowData: WorkflowData,
  workFlowOrigin: { x: number; y: number },
): WorkflowData => {
  const firstNode = flowData.nodes[0];

  const deltaX = workFlowOrigin.x - firstNode.position.x;
  const deltaY = workFlowOrigin.y - firstNode.position.y;

  return {
    nodes: flowData.nodes.map((node) => ({
      ...node,
      position: {
        x: node.position.x + deltaX,
        y: node.position.y + deltaY,
      },
    })),
    edges: flowData.edges,
  };
};

const prependExecutionHeader = (
  itemId: string,
  flowData: WorkflowData,
): WorkflowData => {
  const firstNode = flowData.nodes[0];
  const nodeHeight = firstNode.measured?.height ?? 72;

  const centeredY = firstNode.position.y + nodeHeight / 2;

  return {
    nodes: [
      createTemplateItemHeaderNode({
        itemId,
        y: centeredY,
      }),
      ...flowData.nodes,
    ],
    edges: flowData.edges,
  };
};
