import type { Edge } from "@xyflow/react";

import {
  calculateCombinedBounds,
  calculateExecutionRowBoundary,
  createRowBoundaryContainer,
  positionExecutionHeader,
} from "./templateItemFlowBuilder";

import type {
  ExecutionFlowNode,
  WorkflowData,
} from "../../../../types/templateExecution";

import {
  COMFORTABLE_LAYOUT,
  HEADERNODE_LAYOUT,
  NODE_LAYOUT,
  ROW_LAYOUT,
} from "./layoutConstants";

const getNodeWidth = (node: ExecutionFlowNode): number =>
  node.measured?.width ?? NODE_LAYOUT.defaultWidth;

const getNodeHeight = (node: ExecutionFlowNode): number =>
  node.measured?.height ?? NODE_LAYOUT.defaultHeight;

const getNodeVisualHeight = (node: ExecutionFlowNode): number =>
  getNodeHeight(node) + NODE_LAYOUT.labelGap + NODE_LAYOUT.labelHeight;

const getOriginalBounds = (
  nodes: ExecutionFlowNode[],
): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} => {
  if (nodes.length === 0) {
    return {
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
    };
  }

  return {
    minX: Math.min(...nodes.map((node) => node.position.x)),
    minY: Math.min(...nodes.map((node) => node.position.y)),
    maxX: Math.max(
      ...nodes.map((node) => node.position.x + getNodeWidth(node)),
    ),
    maxY: Math.max(
      ...nodes.map((node) => node.position.y + getNodeVisualHeight(node)),
    ),
  };
};

const positionComfortableNodes = (
  itemId: string,
  nodes: ExecutionFlowNode[],
  prependHeader: boolean,
): ExecutionFlowNode[] => {
  if (nodes.length === 0) {
    return [];
  }

  const sourceBounds = getOriginalBounds(nodes);

  const headerSpace = prependHeader
    ? HEADERNODE_LAYOUT.width + ROW_LAYOUT.headerGap
    : 0;

  const availableWidth = Math.max(
    COMFORTABLE_LAYOUT.maxRowWidth -
      ROW_LAYOUT.leftPadding -
      ROW_LAYOUT.rightPadding -
      headerSpace,
    1,
  );

  const sourceWidth = Math.max(sourceBounds.maxX - sourceBounds.minX, 1);

  const horizontalScale = Math.min(1, availableWidth / sourceWidth);

  const sourceHeight = Math.max(sourceBounds.maxY - sourceBounds.minY, 1);

  const minimumContentHeight =
    COMFORTABLE_LAYOUT.minRowHeight -
    ROW_LAYOUT.topPadding -
    ROW_LAYOUT.bottomPadding;

  const contentHeight = Math.max(minimumContentHeight, sourceHeight);

  const targetStartX = ROW_LAYOUT.leftPadding + headerSpace;

  const targetStartY =
    ROW_LAYOUT.topPadding + (contentHeight - sourceHeight) / 2;

  return nodes.map((node) => ({
    ...node,

    parentId: `execution-row-${itemId}`,

    position: {
      x: targetStartX + (node.position.x - sourceBounds.minX) * horizontalScale,
      y: targetStartY + (node.position.y - sourceBounds.minY),
    },
  }));
};

const getEdgeOffset = (
  edge: Edge,
  nodes: ExecutionFlowNode[],
  edgeIndex: number,
): number => {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  const source = nodeMap.get(edge.source);
  const target = nodeMap.get(edge.target);

  if (!source || !target) {
    return COMFORTABLE_LAYOUT.verticalGap;
  }

  const verticalDistance = Math.abs(target.position.y - source.position.y);

  if (verticalDistance <= COMFORTABLE_LAYOUT.positionTolerance) {
    return 0;
  }

  const lane =
    edgeIndex % Math.max(3, Math.floor(COMFORTABLE_LAYOUT.verticalGap / 4));

  return COMFORTABLE_LAYOUT.verticalGap + lane * COMFORTABLE_LAYOUT.verticalGap;
};

const assignComfortableEdgeHandles = (
  edges: Edge[],
  nodes: ExecutionFlowNode[],
): Edge[] => {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  return edges.map((edge, edgeIndex) => {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);

    if (!sourceNode || !targetNode) {
      return edge;
    }

    const sourceX = sourceNode.position.x;
    const targetX = targetNode.position.x;

    const sourceY = sourceNode.position.y;
    const targetY = targetNode.position.y;

    const horizontalDistance = targetX - sourceX;
    const verticalDistance = targetY - sourceY;

    const isHorizontal =
      Math.abs(verticalDistance) <= COMFORTABLE_LAYOUT.positionTolerance &&
      horizontalDistance >= 0;

    if (isHorizontal) {
      return {
        ...edge,
        sourceHandle: "right",
        targetHandle: "left",
        data: {
          ...edge.data,
          pathType: "straight",
          offset: undefined,
        },
      };
    }

    const originalSourceHandle = edge.sourceHandle;
    const originalTargetHandle = edge.targetHandle;

    const usesVerticalHandle =
      originalSourceHandle === "top" ||
      originalSourceHandle === "bottom" ||
      originalTargetHandle === "top" ||
      originalTargetHandle === "bottom";

    if (usesVerticalHandle) {
      return {
        ...edge,
        sourceHandle: originalSourceHandle,
        targetHandle: originalTargetHandle,
        data: {
          ...edge.data,
          pathType: "smoothstep",
          offset: getEdgeOffset(edge, nodes, edgeIndex),
        },
      };
    }

    if (verticalDistance < 0) {
      return {
        ...edge,
        sourceHandle: "top",
        targetHandle: "bottom",
        data: {
          ...edge.data,
          pathType: "smoothstep",
          offset: getEdgeOffset(edge, nodes, edgeIndex),
        },
      };
    }

    return {
      ...edge,
      sourceHandle: "bottom",
      targetHandle: "top",
      data: {
        ...edge.data,
        pathType: "smoothstep",
        offset: getEdgeOffset(edge, nodes, edgeIndex),
      },
    };
  });
};

export const buildComfortableTemplateItemFlow = (
  itemId: string,
  flowData: WorkflowData,
  prependHeader = false,
) => {
  const positionedNodes = positionComfortableNodes(
    itemId,
    flowData.nodes,
    prependHeader,
  );

  const positionedEdges = assignComfortableEdgeHandles(
    flowData.edges,
    positionedNodes,
  );

  const dagBounds = calculateCombinedBounds(positionedNodes, positionedEdges);

  const headerNode = prependHeader
    ? positionExecutionHeader(itemId, dagBounds)
    : null;

  const contentNodes = headerNode
    ? [headerNode, ...positionedNodes]
    : positionedNodes;

  const calculatedBoundary = calculateExecutionRowBoundary(
    dagBounds,
    prependHeader,
    COMFORTABLE_LAYOUT.minRowWidth,
    COMFORTABLE_LAYOUT.minRowHeight,
  );

  const rowContainer = createRowBoundaryContainer(itemId, calculatedBoundary);

  return {
    nodes: [rowContainer, ...contentNodes],
    edges: positionedEdges,
  };
};
