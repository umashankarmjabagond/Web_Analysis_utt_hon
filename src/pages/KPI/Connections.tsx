import { useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "../../components/forms/button/Button";
import ConnectionTree from "../../components/common/tree/ConnectionTree";

import type { TreeNodeData } from "../../types/commonTypes";

import { ChevronRight, ChevronLeft, MoveRight, X } from "lucide-react";

const allColumnsData: TreeNodeData[] = [
  {
    id: "ds",
    label: "DPR1 Data Preprocessing",
    children: [
      {
        id: "sample",
        label: "TimeSeriesSample",
        children: [
          {
            id: "pv",
            label: "DPR1.PV",
          },
          {
            id: "mode",
            label: "DPR1.MODE",
          },
          {
            id: "op",
            label: "DPR1.OP",
          },
          {
            id: "sp",
            label: "DPR1.SP",
          },
        ],
      },
    ],
  },
];

const buildSelectedTreeFromSource = (
  sourceNodes: TreeNodeData[],
  selectedIds: string[],
): TreeNodeData[] => {
  return sourceNodes
    .map((node) => {
      if (!node.children?.length) {
        return selectedIds.includes(node.id) ? { ...node } : null;
      }

      const children = buildSelectedTreeFromSource(node.children, selectedIds);

      if (children.length > 0) {
        return {
          ...node,
          children,
        };
      }

      return null;
    })
    .filter(Boolean) as TreeNodeData[];
};

export default function Connections() {
  const { t } = useTranslation();

  const [leftCheckedIds, setLeftCheckedIds] = useState<string[]>([]);

  const [rightCheckedIds, setRightCheckedIds] = useState<string[]>([]);

  const [selectedColumns, setSelectedColumns] = useState<TreeNodeData[]>([
    {
      id: "ds",
      label: "DPR1 Data Preprocessing",
      children: [
        {
          id: "sample",
          label: "TimeSeriesSample",
          children: [],
        },
      ],
    },
  ]);

  const toggleLeftCheck = (id: string) => {
    setLeftCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleRightCheck = (id: string) => {
    setRightCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const findLeafNodes = (
    nodes: TreeNodeData[],
    ids: string[],
  ): TreeNodeData[] => {
    let result: TreeNodeData[] = [];

    for (const node of nodes) {
      if (ids.includes(node.id) && !node.children?.length) {
        result.push(node);
      }

      if (node.children) {
        result = [...result, ...findLeafNodes(node.children, ids)];
      }
    }

    return result;
  };

  const moveToSelected = () => {
    const existingIds = new Set<string>();

    const collectIds = (nodes: TreeNodeData[]) => {
      nodes.forEach((node) => {
        if (!node.children?.length) {
          existingIds.add(node.id);
        }

        if (node.children) {
          collectIds(node.children);
        }
      });
    };

    collectIds(selectedColumns);

    const mergedIds = [...existingIds, ...leftCheckedIds];

    const tree = buildSelectedTreeFromSource(allColumnsData, mergedIds);

    setSelectedColumns(
      tree.length > 0
        ? tree
        : [
            {
              id: "ds",
              label: "DPR1 Data Preprocessing",
              children: [
                {
                  id: "sample",
                  label: "TimeSeriesSample",
                  children: [],
                },
              ],
            },
          ],
    );

    setLeftCheckedIds([]);
  };

  const removeFromSelected = () => {
    const remainingIds: string[] = [];

    const collectLeafIds = (nodes: TreeNodeData[]) => {
      nodes.forEach((node) => {
        if (!node.children?.length) {
          if (!rightCheckedIds.includes(node.id)) {
            remainingIds.push(node.id);
          }
        }

        if (node.children) {
          collectLeafIds(node.children);
        }
      });
    };

    collectLeafIds(selectedColumns);

    setSelectedColumns(
      buildSelectedTreeFromSource(allColumnsData, remainingIds),
    );

    setRightCheckedIds([]);
  };

  return (
    <div className="flex w-full flex-col bg-background p-6 max-h-[843.2px] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="pb-4 h-[102px] px-10 pt-10 gap-3">
        <div className="flex items-center justify-between h-[30px]">
          <h2 className="font-bold h-[30px] text-[20px] leading-[30px] tracking-[0px] text-[#F0F0F0]">
            Configure Input Columns
          </h2>

          <button
            type="button"
            aria-label={t("COMMON_CLOSE")}
            className="
    flex h-8 rounded-[6px] w-8 shrink-0 cursor-pointer
    items-center justify-center p-2
    text-drawer-close-foreground
    transition-colors
    hover:bg-drawer-close-hover-background
    hover:text-drawer-close-hover-foreground
  "
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        <div className="mt-2 flex items-center text-sm text-muted-foreground h-4">
          <span className="h-4 text-[12px] leading-4 font-medium tracking-[0px] text-[#B0B0B0]">
            Data Preprocessing
          </span>

          <MoveRight size={14} className="mx-2" />

          <span className="h-4 text-[12px] leading-4 font-medium tracking-[0px] text-[#B0B0B0]">
            Data Source
          </span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex flex-1 flex-col px-10 py-4 min-h-0">
        <p className="mt-4 mb-6 text-muted-foreground h-5 text-[13px] leading-[19.5px] font-medium tracking-[0px]">
          Please select the inputs to be given from{" "}
          <strong>"Data Preprocessing"</strong> to{" "}
          <strong>"Data Source"</strong>.
        </p>

        {/* Panel Titles */}
        <div className="grid grid-cols-[1fr_40px_1fr] gap-6 mb-2">
          <div className="h-[16px]">
            <h3 className="h-4 text-[12px] leading-4 font-bold uppercase tracking-[0.3px] text-[#B0B0B0]">
              DATA PREPROCESSING
            </h3>
          </div>

          <div />

          <div className="h-[16px]">
            <h3 className="h-4 text-[12px] leading-4 font-bold uppercase tracking-[0.3px] text-[#B0B0B0]">
              DATA SOURCE
            </h3>
          </div>
        </div>

        {/* Panels */}
        <div className="flex h-[308px] gap-6">
          {/* Left Panel */}
          <div className="flex min-h-0 flex-1 overflow-hidden rounded-[6px] border border-border-default pt-[6px] pl-[6px] pb-[6px]">
            <div className="h-full w-full min-h-0 overflow-y-auto py-1">
              <ConnectionTree
                nodes={allColumnsData}
                checkedIds={leftCheckedIds}
                onCheck={toggleLeftCheck}
                showCheckbox={true}
              />
            </div>
          </div>

          {/* Middle Buttons */}
          <div className="flex w-[40px] flex-col items-center justify-center gap-6">
            <Button
              variant="secondary"
              fill="outline"
              iconOnly
              icon={<ChevronRight size={16} />}
              onClick={moveToSelected}
            />

            <Button
              variant="secondary"
              fill="outline"
              iconOnly
              icon={<ChevronLeft size={16} />}
              onClick={removeFromSelected}
            />
          </div>

          {/* Right Panel */}
          <div className="flex-1 overflow-hidden rounded-[6px] border border-border-default pt-[6px] pl-[6px] pb-[6px]">
            <div className="h-full overflow-y-auto gap-[6px] py-1">
              <>
                <ConnectionTree
                  nodes={selectedColumns}
                  checkedIds={rightCheckedIds}
                  onCheck={toggleRightCheck}
                  showCheckbox={true}
                />

                {selectedColumns?.[0]?.children?.[0]?.children?.length ===
                  0 && (
                  <div className="ml-[72px] mt-2 text-[12px] leading-[19.5px] font-medium text-muted-foreground">
                    None
                  </div>
                )}
              </>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-end gap-3 border-border-default px-10">
        <Button variant="secondary" fill="outline">
          Cancel
        </Button>

        <Button variant="primary">Finish</Button>
      </div>
    </div>
  );
}
