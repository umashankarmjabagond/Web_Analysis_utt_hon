import { useState } from "react";
import { BaseEdge, type EdgeProps } from "@xyflow/react";
import { Plus } from "lucide-react";

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
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  selected,
  markerEnd,
  data,
}: WorkflowEdgeProps) {
  const [hovered, setHovered] = useState(false);

  const dx = targetX - sourceX;
  const dy = targetY - sourceY;

  const distance = Math.sqrt(dx * dx + dy * dy);

  const offset = Math.max(distance * 0.3, 10);

  const targetControlY = targetY - dy * 0.35;

  const path = `
    M ${sourceX},${sourceY}
    C
      ${sourceX + offset},${sourceY}
      ${targetX - offset},${targetControlY}
      ${targetX},${targetY}
  `;

  const t = 0.5;
  const mt = 1 - t;

  const bezierX =
    mt * mt * mt * sourceX +
    3 * mt * mt * t * (sourceX + offset) +
    3 * mt * t * t * (targetX - offset) +
    t * t * t * targetX;

  const bezierY =
    mt * mt * mt * sourceY +
    3 * mt * mt * t * sourceY +
    3 * mt * t * t * targetControlY +
    t * t * t * targetY;

  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <BaseEdge
        id={id}
        path={path}
        markerEnd={markerEnd}
        style={{
          stroke: selected ? "var(--edge-selected)" : "var(--edge-default)",
          strokeWidth: 2,
        }}
      />

      <path d={path} fill="none" stroke="transparent" strokeWidth={20} />

      {hovered && (
        <foreignObject x={bezierX - 10} y={bezierY - 10} width={24} height={24}>
          <button
            onClick={(e) => {
              e.stopPropagation();

              data?.onEdgeInsert?.({
                id,
                source,
                target,
              });
            }}
            className="flex h-5 w-5 t-0.5 l-0.5 items-center justify-center rounded-full border-2 border-node-insert-border text-node-insert-foreground shadow-lg transition-all bg-node-insert-background cursor-pointer"
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </foreignObject>
      )}
    </g>
  );
}
