import {
  Background,
  BackgroundVariant,
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

export default function WorkflowCanvas({
  executionContext,
}: WorkflowCanvasProps) {
  const { template, itemId } = useParams();
  const showDetailsPanel = executionContext === "asset";

  const nodes = useTemplateExecutionStore((state) => state.nodes);
  const edges = useTemplateExecutionStore((state) => state.edges);

  const isNodeDrawerOpen = useTemplateExecutionStore(
    (state) => state.isNodeDrawerOpen,
  );

  const { handleNodeSelection } = useWorkflowCanvasInteractions();

  const onNodeClick: NodeMouseHandler<ExecutionFlowNode> = (_, node) => {
    if (node.type === "executionHeader") return;

    const baseNode = node as BaseFlowNode;
    handleNodeSelection(baseNode.id, baseNode.data.status);
  };

  return (
    <>
      <div
        className={`h-full bg-app-surface ${showDetailsPanel && "flex h-full flex-col"} `}
      >
        <div className={showDetailsPanel ? "flex-1 min-h-0" : "h-full"}>
          <ReactFlow
            key={`template-${template}-item-${itemId ?? "unit"}`}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodeClick={onNodeClick}
            proOptions={{ hideAttribution: true }}
          >
            <Background
              color="var(--app-surface-elevated)"
              size={3}
              variant={BackgroundVariant.Dots}
              gap={25}
            />
          </ReactFlow>
        </div>

        {showDetailsPanel && (
          <div className="h-[60%] overflow-y-auto flex flex-col">
            <ExecutionDetailsPanel />
          </div>
        )}
      </div>

      {isNodeDrawerOpen && <ExecutionNodeDrawer />}
    </>
  );
}
