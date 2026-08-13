import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  ReactFlow,
  type NodeMouseHandler,
} from "@xyflow/react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { nodeTypes } from "./nodes/nodeTypes";
import { edgeTypes } from "./edges/edgeTypes";
import ExecutionDetailsPanel from "./ExecutionDetailsPanel";
import ExecutionNodeDrawer from "./ExecutionNodeDrawer";

import { useTemplateExecutionStore } from "../../../../store/templateExecutionStore";
import { useWorkflowCanvasInteractions } from "../../../../hooks/useWorkflowInteractions";
import type {
  BaseFlowNode,
  ExecutionFlowNode,
  WorkflowCanvasProps,
} from "../../../../types/templateExecution";
import { Loader2 } from "lucide-react";

export default function WorkflowCanvas({
  executionContext,
  loadMore,
  hasMore,
  isLoadingMore,
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

  const SCROLL_THRESHOLD = 300; // px from bottom to trigger next fetch

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!hasMore || isLoadingMore) return;

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

    if (distanceFromBottom < SCROLL_THRESHOLD) {
      loadMore();
    }
  };

  return (
    <>
      <div
        className={`relative h-full bg-app-surface ${showDetailsPanel ? "flex flex-col" : ""}`}
      >
        <div
          className={`overflow-auto ${showDetailsPanel ? "flex-1 min-h-0" : "h-full"}`}
          onScroll={handleScroll}
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

          {isLoadingMore && (
            <div className="pointer-events-none absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-md bg-app-primary px-3 py-2 text-sm text-app-text-primary shadow-lg">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading more rows...</span>
            </div>
          )}
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
