import { BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react";

export default function ExecuctionWorkflowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  ...props
}: EdgeProps) {
  const { markerEnd } = props;
  const [path] = getBezierPath({
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
      path={path}
      markerEnd={markerEnd}
      style={{ stroke: "var(--app-default-edge)", strokeWidth: 2 }}
    />
  );
}
