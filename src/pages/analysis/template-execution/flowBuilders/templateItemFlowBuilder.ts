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

import {
  CANVAS_LAYOUT,
  HEADERNODE_LAYOUT,
  NODE_LAYOUT,
  ROW_LAYOUT,
} from "./layoutConstants";

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
    offset: edge.data?.offset as number | undefined,
  }));
};

/**
 * --------------------------------------------------------------------------
 * Combined node + edge bounds
 * --------------------------------------------------------------------------
 */

export const calculateCombinedBounds = (
  nodes: ExecutionFlowNode[],
  edges: WorkflowData["edges"],
): Bounds => {
  if (nodes.length === 0) {
    return {
      minX: 0,
      minY: 0,
      width: 0,
      height: 0,
    };
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

/**
 * --------------------------------------------------------------------------
 * DAG bounds
 * --------------------------------------------------------------------------
 */

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

    if (!sourceNode || !targetNode) {
      return;
    }

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
      offset: edge.offset,
    });

    const pathBounds = measurePathBounds(path);

    minX = Math.min(minX, pathBounds.x);
    minY = Math.min(minY, pathBounds.y);
    maxX = Math.max(maxX, pathBounds.x + pathBounds.width);
    maxY = Math.max(maxY, pathBounds.y + pathBounds.height);
  });

  return {
    minX,
    minY,
    width: Math.max(0, maxX - minX),
    height: Math.max(0, maxY - minY),
  };
};

/**
 * --------------------------------------------------------------------------
 * Position workflow
 * --------------------------------------------------------------------------
 */

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

/**
 * --------------------------------------------------------------------------
 * Header
 * --------------------------------------------------------------------------
 *
 * Header is centered vertically using the FINAL content height.
 */
export const positionExecutionHeader = (
  itemId: string,
  dagBounds: Bounds,
): ExecutionFlowNode => {
  const contentHeight = Math.max(dagBounds.height, HEADERNODE_LAYOUT.height);

  const rowContentTop = ROW_LAYOUT.topPadding;

  const headerY =
    rowContentTop + (contentHeight - HEADERNODE_LAYOUT.height) / 2;

  return createTemplateItemHeaderNode({
    itemId,
    y: headerY,
  });
};

/**
 * --------------------------------------------------------------------------
 * Header node
 * --------------------------------------------------------------------------
 */

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

/**
 * --------------------------------------------------------------------------
 * Row boundary
 * --------------------------------------------------------------------------
 */

export const calculateExecutionRowBoundary = (
  dagBounds: Bounds,
  hasHeader: boolean,
  minWidth = 0,
  minHeight = 0,
): ExecutionRowBoundary => {
  const contentHeight = Math.max(
    dagBounds.height,
    hasHeader ? HEADERNODE_LAYOUT.height : 0,
  );

  /**
   * dagBounds are in the row's coordinate system.
   *
   * minX may be negative when an edge bends left.
   * Therefore calculate the right-most point directly.
   */
  const absoluteMaxX = dagBounds.minX + dagBounds.width;

  const calculatedWidth = absoluteMaxX + ROW_LAYOUT.rightPadding;

  const calculatedHeight =
    contentHeight + ROW_LAYOUT.topPadding + ROW_LAYOUT.bottomPadding;

  return {
    width: Math.max(calculatedWidth, minWidth),

    height: Math.max(calculatedHeight, minHeight),
  };
};

export const createRowBoundaryContainer = (
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
  selectable: true,
  data: {
    itemId,
  },
});
