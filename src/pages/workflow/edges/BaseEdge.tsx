import { useState } from "react";
import { BaseEdge, getSmoothStepPath, type EdgeProps } from "@xyflow/react";

interface WorkflowEdgeProps extends EdgeProps {
  data?: {
    onEdgeInsert?: (edge: {
      id: string;
      source: string;
      target: string;
    }) => void;
  };
}

export default function WorkflowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  markerEnd,
}: WorkflowEdgeProps) {
  const [hovered, setHovered] = useState(false);

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 0,
    offset: 5,
    stepPosition: 0.5,
  });

  const edgeColor = selected ? "" : hovered ? "" : "#4FB3FF";

  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: edgeColor,
          strokeWidth: hovered || selected ? 1.2 : 1,
          transition: "stroke 150ms ease, stroke-width 150ms ease",
        }}
      />

      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={10}
        pointerEvents="stroke"
      />
    </g>
  );
}
