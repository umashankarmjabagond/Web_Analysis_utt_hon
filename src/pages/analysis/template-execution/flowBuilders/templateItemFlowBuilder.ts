import type {
  CreateExecutionHeaderNodeProps,
  ExecutionFlowNode,
  WorkflowData,
} from "../../../../types/templateExecution";

type ExecutionBounds = {
  minX: number;
  minY: number;
  width: number;
  height: number;
};

type ExecutionRowBoundary = {
  width: number;
  height: number;
};

const CANVAS_LAYOUT = {
  rowLeft: 24,
  rowTop: 24,
};

const ROW_LAYOUT = {
  topPadding: 24,
  rightPadding: 24,
  bottomPadding: 24,
  leftPadding: 50,
  headerGap: 12,
};

const HEADERNODE_LAYOUT = {
  width: 160,
  height: 24,
};

const NODE_LAYOUT = {
  defaultWidth: 30,
  defaultHeight: 30,
  labelHeight: 15,
  labelGap: 2,
};

export const buildTemplateItemFlow = (
  itemId: string,
  flowData: WorkflowData,
  prependHeader = false,
) => {
  const sourceBounds = calculateExecutionBounds(flowData.nodes);

  const positionedFlow = positionWorkflow(
    itemId,
    flowData,
    sourceBounds,
    prependHeader,
  );

  const dagBounds = calculateExecutionBounds(positionedFlow.nodes);

  const headerNode = prependHeader
    ? positionExecutionHeader(itemId, dagBounds)
    : null;

  const contentNodes = headerNode
    ? [headerNode, ...positionedFlow.nodes]
    : positionedFlow.nodes;

  const rowBoundary = calculateExecutionRowBoundary(contentNodes);

  const rowContainer = createRowBoundaryContainer(itemId, rowBoundary);

  return {
    nodes: [rowContainer, ...contentNodes],
    edges: positionedFlow.edges,
  };
};

const getNodeVisualHeight = (node: ExecutionFlowNode): number => {
  const nodeHeight = node.measured?.height ?? NODE_LAYOUT.defaultHeight;

  return nodeHeight + NODE_LAYOUT.labelGap + NODE_LAYOUT.labelHeight;
};

const calculateExecutionBounds = (
  nodes: ExecutionFlowNode[],
): ExecutionBounds => {
  if (nodes.length === 0) {
    return {
      minX: 0,
      minY: 0,
      width: 0,
      height: 0,
    };
  }

  const minX = Math.min(...nodes.map((node) => node.position.x));
  const minY = Math.min(...nodes.map((node) => node.position.y));

  const maxX = Math.max(
    ...nodes.map(
      (node) =>
        node.position.x + (node.measured?.width ?? NODE_LAYOUT.defaultWidth),
    ),
  );

  const maxY = Math.max(
    ...nodes.map((node) => node.position.y + getNodeVisualHeight(node)),
  );

  return {
    minX,
    minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

const positionWorkflow = (
  itemId: string,
  flowData: WorkflowData,
  sourceBounds: ExecutionBounds,
  hasHeader: boolean,
) => {
  const contentHeight = Math.max(
    sourceBounds.height,
    hasHeader ? HEADERNODE_LAYOUT.height : 0,
  );

  const targetX =
    ROW_LAYOUT.leftPadding +
    (hasHeader ? HEADERNODE_LAYOUT.width + ROW_LAYOUT.headerGap : 0);

  const targetY =
    ROW_LAYOUT.topPadding + (contentHeight - sourceBounds.height) / 2;

  const deltaX = targetX - sourceBounds.minX;
  const deltaY = targetY - sourceBounds.minY;

  return {
    nodes: flowData.nodes.map((node) => ({
      ...node,
      parentId: `execution-row-${itemId}`,
      position: {
        x: node.position.x + deltaX,
        y: node.position.y + deltaY,
      },
    })),
    edges: flowData.edges,
  };
};

const positionExecutionHeader = (
  itemId: string,
  dagBounds: ExecutionBounds,
): ExecutionFlowNode => {
  const contentHeight = Math.max(dagBounds.height, HEADERNODE_LAYOUT.height);

  const headerY =
    ROW_LAYOUT.topPadding + (contentHeight - HEADERNODE_LAYOUT.height) / 2;

  return createTemplateItemHeaderNode({
    itemId,
    y: headerY,
  });
};

export const createTemplateItemHeaderNode = ({
  itemId,
  y,
}: CreateExecutionHeaderNodeProps): ExecutionFlowNode => ({
  id: `execution-header-${itemId}`,
  parentId: `execution-row-${itemId}`,
  type: "executionHeader",
  position: {
    x: ROW_LAYOUT.leftPadding,
    y,
  },
  draggable: false,
  selectable: false,
  data: {
    itemId,
  },
});

const calculateExecutionRowBoundary = (
  nodes: ExecutionFlowNode[],
): ExecutionRowBoundary => {
  if (nodes.length === 0) {
    return {
      width: ROW_LAYOUT.leftPadding + ROW_LAYOUT.rightPadding,
      height: ROW_LAYOUT.topPadding + ROW_LAYOUT.bottomPadding,
    };
  }

  const bounds = calculateExecutionBounds(nodes);

  return {
    width: bounds.width + ROW_LAYOUT.leftPadding + ROW_LAYOUT.rightPadding,
    height: bounds.height + ROW_LAYOUT.topPadding + ROW_LAYOUT.bottomPadding,
  };
};

const createRowBoundaryContainer = (
  itemId: string,
  boundary: ExecutionRowBoundary,
): ExecutionFlowNode => ({
  id: `execution-row-${itemId}`,
  type: "executionRow",
  position: {
    x: CANVAS_LAYOUT.rowLeft,
    y: CANVAS_LAYOUT.rowTop,
  },
  style: {
    width: boundary.width,
    height: boundary.height,
  },
  zIndex: -1,
  draggable: false,
  selectable: false,
  data: {
    itemId,
  },
});
