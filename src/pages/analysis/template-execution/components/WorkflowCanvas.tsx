import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  ReactFlow,
  type NodeMouseHandler,
} from "@xyflow/react";

import { nodeTypes } from "./nodes/nodeTypes";
import { useTemplateExecutionStore } from "../../../../store/templateExecutionStore";
import { edgeTypes } from "./edges/edgeTypes";
import { useWorkflowCanvasInteractions } from "../../../../hooks/useWorkflowInteractions";
import type {
  BaseFlowNode,
  ExecutionFlowNode,
  WorkflowCanvasProps,
} from "../../../../types/templateExecution";
import { useParams } from "react-router-dom";
import ExecutionNodeDrawer from "./ExecutionNodeDrawer";
import ExecutionDetailsPanel from "./ExecutionDetailsPanel";
import { useMemo } from "react";

export default function WorkflowCanvas({
  executionContext,
}: WorkflowCanvasProps) {
  const { template, itemId } = useParams();
  const showDetailsPanel = executionContext === "asset";

  const nodes = useTemplateExecutionStore((state) => state.nodes);
  const edges = useTemplateExecutionStore((state) => state.edges);

  const { handleNodeSelection } = useWorkflowCanvasInteractions();

  const onNodeClick: NodeMouseHandler<ExecutionFlowNode> = (_, node) => {
    if (node.type === "executionHeader") return;

    const baseNode = node as BaseFlowNode;
    handleNodeSelection(baseNode.id, baseNode.data.status);
  };

  const { contentWidth, contentHeight } = useMemo(() => {
    const mxaX = Math.max(...nodes.map((n) => n.position.x + 200), 800);
    const mxaY = Math.max(...nodes.map((n) => n.position.y + 150), 400);
    return { contentWidth: mxaX, contentHeight: mxaY };
  }, [nodes]);

  return (
    <>
      <div
        className={`h-full bg-surface ${showDetailsPanel ? "flex flex-col" : ""} `}
      >
        <div
          className={`overflow-auto ${showDetailsPanel ? "flex-1 min-h-0" : "h-full"}`}
        >
          <div style={{ width: contentWidth, height: contentHeight }}>
            <ReactFlow
              key={`template-${template}-item-${itemId ?? "unit"}`}
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodeClick={onNodeClick}
              connectionMode={ConnectionMode.Loose}
              preventScrolling={false}
              panOnScroll={false}
              panOnDrag={false}
              zoomOnScroll={false}
              zoomOnPinch={false}
              zoomOnDoubleClick={false}
              nodesDraggable={false}
              minZoom={1}
              maxZoom={1}
              fitView={false}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              proOptions={{ hideAttribution: true }}
            >
              <Background
                color="var(--surface-elevated)"
                size={3}
                variant={BackgroundVariant.Dots}
                gap={25}
              />
            </ReactFlow>
          </div>
        </div>

        {showDetailsPanel && (
          <div className="h-[60%] overflow-y-auto flex flex-col">
            <ExecutionDetailsPanel />
          </div>
        )}
      </div>

      <ExecutionNodeDrawer />
    </>
  );
}
