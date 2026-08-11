// import { memo } from "react";
// import { Handle, Position } from "@xyflow/react";

// import type { WorkflowNodeData } from "../../../types/workFlowTypes";

// interface BaseNodeProps {
//   data: WorkflowNodeData;
// }

// function BaseNode({ data }: BaseNodeProps) {
//   const { label, element } = data;

//   return (
//     <div className="relative min-w-[120px] rounded-md border border-app-surface-background bg-app-code-background shadow-md transition-all duration-200 hover:border-component-hover-border">
//       {/* Target Handle */}
//       <Handle
//         type="target"
//         position={Position.Left}
//         style={{
//           width: 12,
//           height: 12,
//           left: 0,
//           background: "transparent",
//           border: "none",
//           opacity: 0,
//         }}
//       />

//       <div className="flex flex-col items-center px-3 py-2">
//         <div className="text-sm">📄</div>

//         <div className="mt-1 text-center text-sm font-medium text-white">
//           {label}
//         </div>

//         <div className="mt-1 text-[10px] uppercase tracking-wider text-gray-400">
//           {element.elementType}
//         </div>
//       </div>

//       {/* Source Handle */}
//       <Handle
//         type="source"
//         position={Position.Right}
//         style={{
//           width: 12,
//           height: 12,
//           background: "var(--app-background-light)",
//           border: "2px solid var(--app-surface-background)",
//         }}
//       />
//     </div>
//   );
// }

// export default memo(BaseNode);

import React, { memo } from "react";

import { Handle, Position } from "@xyflow/react";

import { attributeCatalogSections } from "../workflowPanelData ";

import { GitBranch, type LucideIcon } from "lucide-react";

import type { WorkflowNodeData } from "../../../types/workFlowTypes";

interface BaseNodeProps {
  data: WorkflowNodeData;
}

const catalogIconMap: Record<string, LucideIcon> = {};

for (const section of attributeCatalogSections) {
  for (const item of section.items) {
    if (item.icon) {
      catalogIconMap[item.id] = item.icon;
    }
  }
}

interface NodeIconProps {
  catalogId?: string;

  className: string;
}

function NodeIcon({ catalogId, className }: NodeIconProps) {
  const icon = catalogId ? catalogIconMap[catalogId] : undefined;

  if (!icon) {
    return <GitBranch size={20} strokeWidth={1.8} className={className} />;
  }

  return React.createElement(icon, {
    size: 20,
    strokeWidth: 1.8,
    className,
  });
}

function BaseNode({ data }: BaseNodeProps) {
  const { label, element, catalogId } = data;

  const isDataSink = element?.elementType?.toLowerCase() === "datasink";

  const iconClassName = isDataSink ? "text-[#8A8A8A]" : "text-[#45C95A]";

  const nodeBorderClassName = isDataSink
    ? "border border-[#555555]"
    : "border border-[#36B94A]";

  const labelClassName = isDataSink ? "text-[#8A8A8A]" : "text-[#B8B8B8]";

  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          relative
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-[6px]
          bg-[#111111]
          transition-all
          duration-150
          ${nodeBorderClassName}
        `}
      >
        <Handle
          type="target"
          position={Position.Left}
          style={{
            width: 10,
            height: "70%",
            left: -5,
            top: "50%",
            transform: "translateY(-50%)",
            background: "transparent",
            border: "none",
            opacity: 0,
          }}
        />

        <NodeIcon catalogId={catalogId} className={iconClassName} />

        <Handle
          type="source"
          position={Position.Right}
          style={{
            width: 10,
            height: "70%",
            right: -5,
            top: "50%",
            transform: "translateY(-50%)",
            background: "transparent",
            border: "none",
            opacity: 0,
          }}
        />
      </div>

      <div
        className={`
          mt-1.5
          max-w-[100px]
          whitespace-nowrap
          text-center
          text-[10px]
          font-normal
          leading-3
          ${labelClassName}
        `}
      >
        {label}
      </div>
    </div>
  );
}

export default memo(BaseNode);
