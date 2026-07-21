import { BaseEdge } from "@xyflow/react";
import type { EdgeProps } from "@xyflow/react";

export default function WorkflowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  selected,
  markerEnd,
}: EdgeProps) {
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;

  // Distance between nodes
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Base horizontal offset
  const offset = Math.max(distance * 0.3, 10);

  // Last control point moves depending on vertical direction
  const targetControlY = targetY - dy * 0.35;

  const path = `
    M ${sourceX},${sourceY}
    C
      ${sourceX + offset},${sourceY}
      ${targetX - offset},${targetControlY}
      ${targetX},${targetY}
  `;

  return (
    <BaseEdge
      id={id}
      path={path}
      markerEnd={markerEnd}
      style={{
        stroke: selected ? "#4F9DFF" : "#BDBDBD",
        strokeWidth: 2,
      }}
    />
  );
}
