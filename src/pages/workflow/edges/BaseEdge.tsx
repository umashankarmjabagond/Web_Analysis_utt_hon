// import { useState } from "react";
// import { BaseEdge, type EdgeProps } from "@xyflow/react";
// import { Plus } from "lucide-react";

// interface WorkflowEdgeProps extends EdgeProps {
//   data?: {
//     onEdgeInsert?: (edge: {
//       id: string;
//       source: string;
//       target: string;
//     }) => void;
//   };
// }

// export default function WorkflowEdge({
//   id,
//   source,
//   target,
//   sourceX,
//   sourceY,
//   targetX,
//   targetY,
//   selected,
//   markerEnd,
//   data,
// }: WorkflowEdgeProps) {
//   const [hovered, setHovered] = useState(false);

//   const dx = targetX - sourceX;
//   const dy = targetY - sourceY;

//   const distance = Math.sqrt(dx * dx + dy * dy);

//   const offset = Math.max(distance * 0.3, 10);

//   const targetControlY = targetY - dy * 0.35;

//   const path = `
//     M ${sourceX},${sourceY}
//     C
//       ${sourceX + offset},${sourceY}
//       ${targetX - offset},${targetControlY}
//       ${targetX},${targetY}
//   `;

//   const t = 0.5;
//   const mt = 1 - t;

//   const bezierX =
//     mt * mt * mt * sourceX +
//     3 * mt * mt * t * (sourceX + offset) +
//     3 * mt * t * t * (targetX - offset) +
//     t * t * t * targetX;

//   const bezierY =
//     mt * mt * mt * sourceY +
//     3 * mt * mt * t * sourceY +
//     3 * mt * t * t * targetControlY +
//     t * t * t * targetY;

//   return (
//     <g
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       <BaseEdge
//         id={id}
//         path={path}
//         markerEnd={markerEnd}
//         style={{
//           stroke: selected ? "var(--component-accent-primary)" : "var(--color-text-muted-secondary)",
//           strokeWidth: 2,
//         }}
//       />

//       <path d={path} fill="none" stroke="transparent" strokeWidth={20} />

//       {hovered && (
//         <foreignObject x={bezierX - 14} y={bezierY - 14} width={28} height={28}>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();

//               data?.onEdgeInsert?.({
//                 id,
//                 source,
//                 target,
//               });
//             }}
//             className="flex h-7 w-7 items-center justify-center rounded-md border border-component-border bg-component-toolbar-background text-component-border shadow-lg transition-all"
//           >
//             <Plus size={14} strokeWidth={2.5} />
//           </button>
//         </foreignObject>
//       )}
//     </g>
//   );
// }

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

    // Smaller gap from node
    offset: 5,

    // Put the step/bend in the middle
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
