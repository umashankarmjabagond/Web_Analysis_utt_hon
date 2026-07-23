import { Background, BackgroundVariant, ReactFlow } from "@xyflow/react";

export default function WorkflowCanvas() {
  return (
    <div className="h-full bg-app-surface">
      <ReactFlow fitView proOptions={{ hideAttribution: true }}>
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
