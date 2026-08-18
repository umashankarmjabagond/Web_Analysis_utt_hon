import type {
  Bounds,
  CreateExecutionHeaderNodeProps,
  EdgePathType,
  ExecutionFlowNode,
  ExecutionRowBoundary,
  LayoutEdge,
  PositionedNodeBounds,
  WorkflowData,
} from "../../../../types/templateExecution";
import {
  getEdgePath,
  getHandleCoordinates,
  measurePathBounds,
} from "./edgeGeometry";

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
  const sourceBounds = calculateCombinedBounds(flowData.nodes, flowData.edges);

  const positionedFlow = positionWorkflow(
    itemId,
    flowData,
    sourceBounds,
    prependHeader,
  );

  const dagBounds = calculateCombinedBounds(
    positionedFlow.nodes,
    positionedFlow.edges,
  );

  const headerNode = prependHeader
    ? positionExecutionHeader(itemId, dagBounds)
    : null;

  const contentNodes = headerNode
    ? [headerNode, ...positionedFlow.nodes]
    : positionedFlow.nodes;

  const rowBoundary = calculateExecutionRowBoundary(dagBounds, prependHeader);

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

const mapToNodeBounds = (
  nodes: ExecutionFlowNode[],
): PositionedNodeBounds[] => {
  return nodes.map((node) => ({
    id: node.id,
    x: node.position.x,
    y: node.position.y,
    width: node.measured?.width ?? NODE_LAYOUT.defaultWidth,
    iconHeight: node.measured?.height ?? NODE_LAYOUT.defaultHeight,
    visualHeight: getNodeVisualHeight(node),
  }));
};

const mapToLayoutEdges = (edges: WorkflowData["edges"]): LayoutEdge[] => {
  return edges.map((edge) => ({
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
    pathType: (edge.data?.pathType ?? "default") as EdgePathType,
  }));
};

// Single source of truth for "how big is this content" — used for both
// initial positioning and final row sizing, so they can never drift apart.
const calculateCombinedBounds = (
  nodes: ExecutionFlowNode[],
  edges: WorkflowData["edges"],
): Bounds => {
  if (nodes.length === 0) {
    return { minX: 0, minY: 0, width: 0, height: 0 };
  }

  const nodeBounds = mapToNodeBounds(nodes);
  const layoutEdges = mapToLayoutEdges(edges);

  const bounds = calculateDagBounds(nodeBounds, layoutEdges);

  return {
    minX: bounds.minX,
    minY: bounds.minY,
    width: bounds.width,
    height: bounds.height,
  };
};

// Merges node bounds (using visualHeight, so labels are included) with
// real edge path bounds (using iconHeight, since handles attach there)
const calculateDagBounds = (
  nodeBounds: PositionedNodeBounds[],
  edges: LayoutEdge[],
): Bounds => {
  const nodeMap = new Map(nodeBounds.map((node) => [node.id, node]));

  let minX = Math.min(...nodeBounds.map((node) => node.x));
  let minY = Math.min(...nodeBounds.map((node) => node.y));
  let maxX = Math.max(...nodeBounds.map((node) => node.x + node.width));
  let maxY = Math.max(...nodeBounds.map((node) => node.y + node.visualHeight));

  edges.forEach((edge) => {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);

    if (!sourceNode || !targetNode) return;

    const source = getHandleCoordinates({
      nodeX: sourceNode.x,
      nodeY: sourceNode.y,
      nodeWidth: sourceNode.width,
      nodeIconHeight: sourceNode.iconHeight,
      handleId: edge.sourceHandle,
    });

    const target = getHandleCoordinates({
      nodeX: targetNode.x,
      nodeY: targetNode.y,
      nodeWidth: targetNode.width,
      nodeIconHeight: targetNode.iconHeight,
      handleId: edge.targetHandle,
    });

    const { path } = getEdgePath(edge.pathType, {
      sourceX: source.x,
      sourceY: source.y,
      targetX: target.x,
      targetY: target.y,
      sourcePosition: source.position,
      targetPosition: target.position,
    });

    const bounds = measurePathBounds(path);

    minX = Math.min(minX, bounds.x);
    minY = Math.min(minY, bounds.y);
    maxX = Math.max(maxX, bounds.x + bounds.width);
    maxY = Math.max(maxY, bounds.y + bounds.height);
  });

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
  sourceBounds: Bounds,
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
  dagBounds: Bounds,
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
  dagBounds: Bounds,
  hasHeader: boolean,
): ExecutionRowBoundary => {
  const contentHeight = Math.max(
    dagBounds.height,
    hasHeader ? HEADERNODE_LAYOUT.height : 0,
  );

  const absoluteMaxX = dagBounds.minX + dagBounds.width;

  return {
    width: absoluteMaxX + ROW_LAYOUT.rightPadding,
    height: contentHeight + ROW_LAYOUT.topPadding + ROW_LAYOUT.bottomPadding,
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
