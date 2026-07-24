import { Background, BackgroundVariant, ReactFlow } from "@xyflow/react";
import { nodeTypes } from "./nodes/nodeTypes";
import { useLoadWorkflow } from "../hooks/useLoadWorkflow";
import { useTemplateExecutionStore } from "../../../../store/templateExecutionStore";

export default function WorkflowCanvas() {
  useLoadWorkflow("56-FFC618");

  const nodes = useTemplateExecutionStore((state) => state.nodes);
  const edges = useTemplateExecutionStore((state) => state.edges);

  return (
    <div className="h-full bg-app-surface">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
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
  );
}
