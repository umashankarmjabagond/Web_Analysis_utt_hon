import type { Edge } from "@xyflow/react";
import { buildCompactSequence } from "./compactSequenceBuilder";
import {
  calculateCombinedBounds,
  calculateExecutionRowBoundary,
  createRowBoundaryContainer,
  positionExecutionHeader,
} from "./templateItemFlowBuilder";
import type {
  ExecutionFlowNode,
  SkipEdgeSpan,
  WorkflowData,
} from "../../../../types/templateExecution";
import {
  COMPACT_LAYOUT,
  HEADERNODE_LAYOUT,
  NODE_LAYOUT,
  ROW_LAYOUT,
  SKIP_EDGE_LAYOUT,
} from "./layoutConstants";

export const getNodeWidth = (node: ExecutionFlowNode): number =>
  node.measured?.width ?? NODE_LAYOUT.defaultWidth;

// Places every node on a single line, left to right, in sequence order,
// all at the same fixed y — the vertical shift to account for arc
// height happens afterward, in normalizeVerticalPosition.
export const layoutSequenceAsLine = (
  sequence: string[],
  nodesById: Map<string, ExecutionFlowNode>,
  startX: number,
  y: number,
): ExecutionFlowNode[] => {
  let cursorX = startX;

  return sequence.map((nodeId) => {
    const node = nodesById.get(nodeId)!;
    const positioned = {
      ...node,
      position: { x: cursorX, y },
    };

    cursorX += getNodeWidth(node) + COMPACT_LAYOUT.horizontalGap;

    return positioned;
  });
};

// Greedy interval scheduling: edges whose sequence-position spans overlap
// get pushed to different lanes; non-overlapping edges can share a lane.
export const assignSkipEdgeLanes = (
  spans: SkipEdgeSpan[],
): Map<number, number> => {
  const sorted = [...spans].sort((a, b) => a.start - b.start);
  const laneEndpoints: number[] = [];
  const laneByEdgeIndex = new Map<number, number>();

  sorted.forEach((span) => {
    let lane = laneEndpoints.findIndex(
      (occupiedEnd) => occupiedEnd < span.start,
    );

    if (lane === -1) {
      lane = laneEndpoints.length;
      laneEndpoints.push(span.end);
    } else {
      laneEndpoints[lane] = span.end;
    }

    laneByEdgeIndex.set(span.edgeIndex, lane);
  });

  return laneByEdgeIndex;
};

// Adjacent-in-sequence edges stay as normal left/right connections.
// Non-adjacent edges are rerouted through top handles with an
// increasing offset per lane, so overlapping arcs don't collide.
export const reassignEdgeHandles = (
  edges: Edge[],
  sequence: string[],
): Edge[] => {
  const indexById = new Map(sequence.map((id, index) => [id, index]));

  const skipSpans: SkipEdgeSpan[] = [];

  edges.forEach((edge, edgeIndex) => {
    const sourceIndex = indexById.get(edge.source);
    const targetIndex = indexById.get(edge.target);

    const isSkip =
      sourceIndex !== undefined &&
      targetIndex !== undefined &&
      Math.abs(targetIndex - sourceIndex) > 1;

    if (isSkip) {
      skipSpans.push({
        edgeIndex,
        start: Math.min(sourceIndex, targetIndex),
        end: Math.max(sourceIndex, targetIndex),
      });
    }
  });

  const laneByEdgeIndex = assignSkipEdgeLanes(skipSpans);

  return edges.map((edge, edgeIndex) => {
    const sourceIndex = indexById.get(edge.source);
    const targetIndex = indexById.get(edge.target);

    const isAdjacent =
      sourceIndex !== undefined &&
      targetIndex !== undefined &&
      Math.abs(targetIndex - sourceIndex) === 1;

    if (isAdjacent) {
      return {
        ...edge,
        sourceHandle: "right",
        targetHandle: "left",
      };
    }

    const lane = laneByEdgeIndex.get(edgeIndex) ?? 0;
    const offset =
      SKIP_EDGE_LAYOUT.baseOffset + lane * SKIP_EDGE_LAYOUT.laneSpacing;

    return {
      ...edge,
      sourceHandle: "top",
      targetHandle: "top",
      data: {
        ...edge.data,
        pathType: "smoothstep",
        offset,
      },
    };
  });
};

// Nodes are initially laid out at a flat baseline y. Skip-edge arcs can
// bulge upward past that baseline, so this measures how far and shifts
// every node down by that amount — same shift-to-origin pattern used in
// templateItemFlowBuilder's positionWorkflow, applied here for the
// y-axis only (x is already correct, since the first node in sequence
// is always the true leftmost point).
export const normalizeVerticalPosition = (
  lineNodes: ExecutionFlowNode[],
  edges: Edge[],
  hasHeader: boolean,
): ExecutionFlowNode[] => {
  const sourceBounds = calculateCombinedBounds(lineNodes, edges);

  const contentHeight = Math.max(
    sourceBounds.height,
    hasHeader ? HEADERNODE_LAYOUT.height : 0,
  );

  const targetY =
    ROW_LAYOUT.topPadding + (contentHeight - sourceBounds.height) / 2;

  const deltaY = targetY - sourceBounds.minY;

  return lineNodes.map((node) => ({
    ...node,
    position: {
      x: node.position.x,
      y: node.position.y + deltaY,
    },
  }));
};

export const buildCompactTemplateItemFlow = (
  itemId: string,
  flowData: WorkflowData,
  prependHeader = false,
) => {
  const sequence = buildCompactSequence(
    flowData.nodes.map((node) => ({
      id: node.id,
      x: node.position.x,
      y: node.position.y,
    })),
    flowData.edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
    })),
  );

  const nodesById = new Map(flowData.nodes.map((node) => [node.id, node]));

  const startX =
    ROW_LAYOUT.leftPadding +
    (prependHeader ? HEADERNODE_LAYOUT.width + ROW_LAYOUT.headerGap : 0);

  const reassignedEdges = reassignEdgeHandles(flowData.edges, sequence);

  const flatNodes = layoutSequenceAsLine(
    sequence,
    nodesById,
    startX,
    ROW_LAYOUT.topPadding,
  );

  const verticallyNormalizedNodes = normalizeVerticalPosition(
    flatNodes,
    reassignedEdges,
    prependHeader,
  );

  const dagBounds = calculateCombinedBounds(
    verticallyNormalizedNodes,
    reassignedEdges,
  );

  const headerNode = prependHeader
    ? positionExecutionHeader(itemId, dagBounds)
    : null;

  const positionedNodes = verticallyNormalizedNodes.map((node) => ({
    ...node,
    parentId: `execution-row-${itemId}`,
  }));

  const contentNodes = headerNode
    ? [headerNode, ...positionedNodes]
    : positionedNodes;

  const rowBoundary = calculateExecutionRowBoundary(dagBounds, prependHeader);

  const rowContainer = createRowBoundaryContainer(itemId, rowBoundary);

  return {
    nodes: [rowContainer, ...contentNodes],
    edges: reassignedEdges,
  };
};
