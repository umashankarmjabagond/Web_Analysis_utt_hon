import { Settings, Link2, Play, Table2 } from "lucide-react";

import type { WorkflowNode } from "../../../types/workFlowTypes";

export type ContextMenuAction =
  | "configure"
  | "connections"
  | "execute"
  | "viewData";

interface NodeContextMenuProps {
  x: number;
  y: number;
  node: WorkflowNode;
  onAction: (action: ContextMenuAction, node: WorkflowNode) => void;
  onClose: () => void;
}

export default function NodeContextMenu({
  x,
  y,
  node,
  onAction,
  onClose,
}: NodeContextMenuProps) {
  const handleAction = (action: ContextMenuAction) => {
    onAction(action, node);
    onClose();
  };

  return (
    <div
      className="
        fixed
        z-[100]
        w-[156px]
        overflow-hidden
        rounded-[4px]
        border
        border-[#454545]
        bg-[#303030]
        py-1
        shadow-xl
      "
      style={{
        left: x,
        top: y,
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <button
        type="button"
        onClick={() => handleAction("configure")}
        className="
              flex
              h-9
              w-full
              items-center
              gap-3
              px-3
              text-left
              text-sm
              text-[#E6E6E6]
              transition-colors
              hover:bg-[#404040]
            "
      >
        <Settings size={14} />
        <span>Configure</span>
      </button>

      <button
        type="button"
        onClick={() => handleAction("connections")}
        className="
              flex
              h-9
              w-full
              items-center
              gap-3
              px-3
              text-left
              text-sm
              text-[#B0B0B0]
              transition-colors
              hover:bg-[#404040]
            "
      >
        <Link2 size={14} />
        <span>Connections</span>
      </button>

      <button
        type="button"
        onClick={() => handleAction("execute")}
        className="
              flex
              h-9
              w-full
              items-center
              gap-3
              px-3
              text-left
              text-sm
              text-[#B0B0B0]
              transition-colors
              hover:bg-[#404040]
            "
      >
        <Play size={14} />
        <span>Execute</span>
      </button>

      <button
        type="button"
        onClick={() => handleAction("viewData")}
        className="
              flex
              h-9
              w-full
              items-center
              gap-3
              px-3
              text-left
              text-sm
              text-[#B0B0B0]
              transition-colors
              hover:bg-[#404040]
            "
      >
        <Table2 size={14} />
        <span>View Data</span>
      </button>
    </div>
  );
}
