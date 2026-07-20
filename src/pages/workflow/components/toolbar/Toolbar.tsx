import {
  ArrowLeft,
  MousePointer2,
  GitBranch,
  Pencil,
  Grid2X2,
  Undo2,
  Redo2,
  Circle,
  Square,
  Type,
  ChevronDown,
  Download,
  Upload,
  MoveRight,
} from "lucide-react";

import ToolbarButton from "./ToolbarButton";
import { useWorkflowStore } from "../../../../store/workflowStore";

export default function Toolbar() {
  const {
    activeTool,
    setActiveTool,
    deleteSelectedNodes,
    deleteSelectedEdges,
    undo,
    redo,
  } = useWorkflowStore();

  return (
    <div className="flex h-12 items-center justify-between border-b border-[#3D3D3D] bg-[#232323] px-3">
      {/* LEFT */}

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 border-r border-[#444] pr-4 text-sm text-white">
          <ArrowLeft size={16} />

          <span>New Template</span>
        </button>

        {/* Pointer */}

        <ToolbarButton
          title="Pointer"
          active={activeTool === "pointer"}
          icon={<MousePointer2 size={15} />}
          onClick={() => setActiveTool("pointer")}
        />

        {/* Connector 1 */}

        <ToolbarButton title="Connector 1" icon={<MoveRight size={15} />} />

        {/* Connector 2 */}

        <ToolbarButton
          title="Connector 2"
          active={activeTool === "connect"}
          icon={<GitBranch size={15} />}
          onClick={() => setActiveTool("connect")}
        />

        {/* Pencil */}

        <ToolbarButton title="Pencil" icon={<Pencil size={15} />} />

        {/* Grid */}

        <ToolbarButton title="Grid" icon={<Grid2X2 size={15} />} />

        {/* Undo */}

        <ToolbarButton title="Undo" icon={<Undo2 size={15} />} onClick={undo} />

        {/* Redo */}

        <ToolbarButton title="Redo" icon={<Redo2 size={15} />} onClick={redo} />

        {/* Delete */}

        <ToolbarButton
          title="Delete"
          icon={<Circle size={15} />}
          onClick={() => {
            deleteSelectedEdges();
            deleteSelectedNodes();
          }}
        />

        {/* Rectangle */}

        <ToolbarButton title="Rectangle" icon={<Square size={15} />} />

        {/* Text */}

        <ToolbarButton title="Text" icon={<Type size={15} />} />
      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-6 text-sm text-[#55AFFF]">
        <button className="flex items-center gap-1 hover:text-white">
          <Upload size={15} />
          Import Template
        </button>

        <button className="flex items-center gap-1 hover:text-white">
          <Download size={15} />
          Export Template
        </button>

        <button className="flex items-center gap-1 hover:text-white">
          Save As
          <ChevronDown size={15} />
        </button>
      </div>
    </div>
  );
}
