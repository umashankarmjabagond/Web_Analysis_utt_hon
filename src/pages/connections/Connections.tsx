import { useState } from "react";

import Tree from "../../components/common/tree/Tree";
import Button from "../../components/forms/button/Button";

import type { TreeNodeData } from "../../types/commonTypes";

import {
  CircleHelp,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const allColumnsData: TreeNodeData[] = [
  {
    id: "ds",
    label: "01-LC0524 DS",
    children: [
      {
        id: "sample",
        label: "TimeSeriesSample",
        children: [
          {
            id: "pv",
            label: "01-LC0524.PV",
          },
          {
            id: "mode",
            label: "03-PC0251.MODE",
          },
          {
            id: "op",
            label: "03-PC0251.OP",
          },
          {
            id: "sp",
            label: "03-PC0251.SP",
          },
        ],
      },
    ],
  },
];

export default function Connections() {
  const [selectedNodeId, setSelectedNodeId] =
    useState<string | null>(null);

  const [allColumns] =
    useState<TreeNodeData[]>(allColumnsData);

  const [selectedColumns, setSelectedColumns] =
    useState<TreeNodeData[]>([]);

  const moveToSelected = () => {
    if (!selectedNodeId) {
      return;
    }

    const node = findNode(
      allColumns,
      selectedNodeId,
    );

    function nodeExists(
  nodes: TreeNodeData[],
  targetId: string,
): boolean {
  for (const node of nodes) {
    if (node.id === targetId) {
      return true;
    }

    if (
      node.children &&
      nodeExists(
        node.children,
        targetId,
      )
    ) {
      return true;
    }
  }

  return false;
}

    if (!node) {
      return;
    }

    if (
      nodeExists(selectedColumns, selectedNodeId

      )) 
      {return}

    setSelectedColumns((prev) => [...prev, node]);
  };

  const removeFromSelected = () => {
    if (!selectedNodeId) {
      return;
    }

    setSelectedColumns((prev) =>
      removeNode(prev, selectedNodeId),
    );
  };

  return (
    <div className="flex h-[590px] w-full flex-col gap-6 bg-[#272727] p-6 text-white border-l border-r border-b border-[#707070]">
      <div className="flex items-center justify-between h-[32px]">
        <h5 className="h-8 w-[146px] text-[24px] font-bold leading-8 text-white">
          Connections
        </h5>

        <div className="flex h-8 items-center gap-3">
          <Button
            variant="secondary"
            size="medium"
            icon={
              <CircleHelp
                size={16}
                strokeWidth={1.5}
                className="text-[#64C3FF]"
              />
            }
            className="!h-8 !w-[96px]"
          >
            Help
          </Button>

          <Button
            variant="secondary"
            size="medium"
            className="!h-8 !w-[124px]"
          >
            Apply to All
          </Button>

          <Button
            variant="primary"
            size="medium"
            className="!h-8 !w-[81px]"
          >
            Save
          </Button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        <div className="flex-1 h-[495px] rounded-[8px] bg-[#404040] overflow-hidden">
  <div className="p-4">
    <h3 className="h-6 text-[16px] font-bold leading-6 text-[#F0F0F0]">
      All Columns
    </h3>
  </div>

  <div className="h-[calc(100%-56px)] overflow-y-auto px-4 pb-4">
    <Tree
      nodes={allColumns}
      selectedId={selectedNodeId}
      onSelect={setSelectedNodeId}
    />
  </div>
</div>

        <div className="flex h-[526px] w-[32px] flex-col items-center justify-center gap-6">
  <Button
    variant="secondary"
    onClick={moveToSelected}
    className="!h-[32px] !w-[32px] !min-w-[32px] !p-2"
  >
    <ChevronRight size={16} />
  </Button>

  <Button
    variant="secondary"
    onClick={removeFromSelected}
    className="!h-[32px] !w-[32px] !min-w-[32px] !p-2"
  >
    <ChevronLeft size={16} />
  </Button>
</div>

        <div className="flex-1 h-[495px] rounded-[8px] bg-[#404040] overflow-hidden">
  <div className="p-4">
    <h3 className="h-6 text-[16px] font-bold leading-6 text-[#F0F0F0]">
      Selected Columns
    </h3>
  </div>

  <div className="h-[calc(100%-56px)] overflow-y-auto px-4 pb-4">
    <Tree
      nodes={selectedColumns}
      selectedId={selectedNodeId}
      onSelect={setSelectedNodeId}
    />
  </div>
</div>
      </div>
    </div>
  );
}

function findNode(
  nodes: TreeNodeData[],
  targetId: string,
): TreeNodeData | null {
  for (const node of nodes) {
    if (node.id === targetId) {
      return node;
    }

    if (node.children) {
      const result = findNode(
        node.children,
        targetId,
      );

      if (result) {
        return result;
      }
    }
  }

  return null;
}

function removeNode(
  nodes: TreeNodeData[],
  targetId: string,
): TreeNodeData[] {
  return nodes
    .filter((node) => node.id !== targetId)
    .map((node) => ({
      ...node,
      children: node.children
        ? removeNode(
            node.children,
            targetId,
          )
        : undefined,
    }));
}