import {
  BaseEdge,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
} from "@xyflow/react";
import type {
  ExecutionWorkflowEdgeProps,
  WorkflowEdgeData,
} from "../../../../../types/templateExecution";

export default function ExecuctionWorkflowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
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
      markerEnd={markerEnd}
      style={{ stroke: "var(--edge-default)", strokeWidth: 2 }}
    />
  );
}

const getPathFn = (path: WorkflowEdgeData["pathType"]) => {
  switch (path) {
    case "smoothstep":
      return getSmoothStepPath;

    case "straight":
      return getStraightPath;

    case "bezier":
    default:
      return getBezierPath;
  }
};
