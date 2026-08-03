import {
  BaseEdge,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  type Edge,
  type EdgeProps,
} from "@xyflow/react";

type WorkflowEdgeData = {
  pathType: "default" | "smoothstep" | "straight" | "bezier";
  animated?: boolean;
};

type WorkflowEdge = Edge<WorkflowEdgeData, "workflow">;
type ExecutionWorkflowEdgeProps = EdgeProps<WorkflowEdge>;

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
      style={{ stroke: "var(--app-default-edge)", strokeWidth: 2 }}
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
