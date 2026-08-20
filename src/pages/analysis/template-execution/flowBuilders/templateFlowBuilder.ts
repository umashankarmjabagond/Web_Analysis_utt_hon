import type { Edge } from "@xyflow/react";
import { buildTemplateItemFlow } from "./templateItemFlowBuilder";
import type {
  ExecutionFlowNode,
  TemplateExecutionWorkflow,
  WorkflowData,
} from "../../../../types/templateExecution";

const ROW_GAP = 24;

const CANVAS_LAYOUT = {
  rowLeft: 24,
  rowTop: 24,
};

type TemplateCanvasResult = WorkflowData & { nextY: number };

export const buildTemplateCanvas = (
  workflows: TemplateExecutionWorkflow[],
  startY = CANVAS_LAYOUT.rowTop,
): TemplateCanvasResult => {
  const PREPEND_HEADER = true;

  const rows = workflows.map((workflow) =>
    buildTemplateItemFlow(workflow.itemId, workflow.workflow, PREPEND_HEADER),
  );

  const rowNodes = rows
    .map((row) => row.nodes.find((node) => node.type === "executionRow"))
    .filter((node): node is ExecutionFlowNode => node !== undefined);

  const maxRowWidth = Math.max(
    ...rowNodes.map((row) =>
      typeof row.style?.width === "number" ? row.style.width : 0,
    ),
    0,
  );

  const nodes: ExecutionFlowNode[] = [];
  const edges: Edge[] = [];

  let offsetY = startY;

  rows.forEach((row) => {
    const rowNode = row.nodes.find((node) => node.type === "executionRow");
    if (!rowNode) {
      return;
    }

    const rowHeight =
      typeof rowNode.style?.height === "number" ? rowNode.style.height : 0;

    const positionedNodes = row.nodes.map((node) => {
      if (node.id !== rowNode.id) {
        return node;
      }

      return {
        ...node,
        position: {
          ...node.position,
          x: CANVAS_LAYOUT.rowLeft,
          y: offsetY,
        },
        style: {
          ...node.style,
          width: maxRowWidth,
        },
      };
    });

    nodes.push(...positionedNodes);
    edges.push(...row.edges);

    offsetY += rowHeight + ROW_GAP;
  });

  return {
    nodes,
    edges,
    nextY: offsetY,
  };
};
