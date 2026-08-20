import { BaseEdge } from "@xyflow/react";
import type { ExecutionWorkflowEdgeProps } from "../../../../../types/templateExecution";
import { getPathFn } from "../../flowBuilders/edgeGeometry";

export default function ExecuctionWorkflowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: ExecutionWorkflowEdgeProps) {
  const pathType = data?.pathType ?? "default";

  const [edgePath] = getPathFn(pathType)({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{ stroke: "var(--edge-default)", strokeWidth: 1 }}
    />
  );
}
