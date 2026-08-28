import { ConnectionMode, ReactFlow } from "@xyflow/react";

import { useMemo } from "react";

import { useParams } from "react-router-dom";

import { nodeTypes } from "./nodes/nodeTypes";
import { edgeTypes } from "./edges/edgeTypes";

import { useTemplateExecutionStore } from "../../../../store/templateExecutionStore";

import type {
  BaseFlowNode,
  ExecutionFlowNode,
  WorkflowCanvasProps,
} from "../../../../types/templateExecution";

import { Loader2 } from "lucide-react";

import { useWorkflowCanvasInteractions } from "../../../../hooks/useWorkflowInteractions";

import NodeModal from "./NodeModal";

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

  const { handleNodeClick } = useWorkflowCanvasInteractions();

  const { contentWidth, contentHeight } = useMemo(() => {
    if (nodes.length === 0) {
      return {
        contentWidth: 800,
        contentHeight: 400,
      };
    }

    let maxX = 800;
    let maxY = 400;

    nodes.forEach((node) => {
      if (node.type !== "executionRow") {
        return;
      }

      const width =
        typeof node.style?.width === "number" ? node.style.width : 0;

      const height =
        typeof node.style?.height === "number" ? node.style.height : 0;

      maxX = Math.max(maxX, node.position.x + width + 24);

      maxY = Math.max(maxY, node.position.y + height + 24);
    });

    return {
      contentWidth: maxX,
      contentHeight: maxY,
    };
  }, [nodes]);

  const SCROLL_THRESHOLD = 300;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!hasMore || isLoadingMore) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

    if (distanceFromBottom < SCROLL_THRESHOLD) {
      loadMore();
    }
  };

  const onNodeClick = (_event: React.MouseEvent, node: ExecutionFlowNode) => {
    if (node.type === "executionHeader" || node.type === "executionRow") {
      return;
    }

    const baseNode = node as BaseFlowNode;

    handleNodeClick(baseNode);
  };

  return (
    <>
      <div
        className={`relative h-full bg-app-surface ${
          showDetailsPanel ? "flex flex-col" : ""
        }`}
      >
        <div
          className={`overflow-auto ${
            showDetailsPanel ? "flex-1 min-h-0" : "h-full"
          }`}
          onScroll={handleScroll}
        >
          <div
            style={{
              width: contentWidth,
              height: contentHeight,
            }}
          >
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
              defaultViewport={{
                x: 0,
                y: 0,
                zoom: 1,
              }}
              proOptions={{
                hideAttribution: true,
              }}
            />

            {isLoadingMore && (
              <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-surface/50">
                <div className="flex items-center gap-2 rounded-md px-3 py-2 text-base text-foreground-accent shadow-lg">
                  <Loader2 size={16} className="h-4 w-4 animate-spin" />

                  <span>Loading more rows...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <NodeModal />
    </>
  );
}
