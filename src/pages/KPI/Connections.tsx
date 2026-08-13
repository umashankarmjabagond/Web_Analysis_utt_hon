import { useState } from "react";
import { useTranslation } from "react-i18next";
import Tree from "../../components/common/tree/Tree";
import Button from "../../components/forms/button/Button";

import type { TreeNodeData } from "../../types/commonTypes";

import { CircleHelp, ChevronRight, ChevronLeft } from "lucide-react";
import { findNode, nodeExists, removeNode } from "../../utils/utils";

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
  const { t } = useTranslation();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const [allColumns] = useState<TreeNodeData[]>(allColumnsData);

  const [selectedColumns, setSelectedColumns] = useState<TreeNodeData[]>([]);

  const moveToSelected = () => {
    if (!selectedNodeId) {
      return;
    }

    const node = findNode(allColumns, selectedNodeId);

    if (!node) {
      return;
    }

    if (nodeExists(selectedColumns, selectedNodeId)) {
      return;
    }

    setSelectedColumns((prev) => [...prev, node]);
  };

  const removeFromSelected = () => {
    if (!selectedNodeId) {
      return;
    }

    setSelectedColumns((prev) => removeNode(prev, selectedNodeId));
  };

  return (
    <div className="flex w-full flex-col gap-6 p-6 border border-t-0 border-border-default">
      <div className="flex h-[32px] items-center justify-between">
        <h5 className="h-8 w-[146px] text-[24px] font-bold leading-8 text-foreground">
          {t("TAB_CONNECTIONS")}
        </h5>

        <div className="flex h-8 items-center gap-3">
          <Button
            variant="secondary"
            fill="outline"
            size="medium"
            icon={
              <CircleHelp
                size={16}
                strokeWidth={1.5}
                className="text-button-primary"
              />
            }
            className="h-8 w-24"
          >
            {t("COMMON_HELP")}
          </Button>

          <Button
            variant="secondary"
            fill="outline"
            size="medium"
            className="h-8 w-31"
          >
            {t("COMMON_APPLY_TO_ALL")}
          </Button>

          <Button variant="primary" size="medium" className="h-8 w-[81px]">
            {t("COMMON_SAVE")}
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-6">
        <div className="h-[495px] flex-1 overflow-hidden rounded-[8px] bg-surface-elevated">
          <div className="p-4">
            <h3 className="h-6 text-[16px] font-bold leading-6 text-foreground">
              {t("CONNECTIONS_ALL_COLUMNS")}
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
            fill="outline"
            iconOnly
            icon={<ChevronRight size={16} />}
            onClick={moveToSelected}
            className="h-[32px] w-[32px] min-w-[32px] p-2"
          />

          <Button
            variant="secondary"
            fill="outline"
            iconOnly
            icon={<ChevronLeft size={16} />}
            onClick={removeFromSelected}
            className="h-[32px] w-[32px] min-w-[32px] p-2"
          />
        </div>

        <div className="h-[495px] flex-1 overflow-hidden rounded-[8px] bg-surface-elevated">
          <div className="p-4">
            <h3 className="h-6 text-[16px] font-bold leading-6 text-foreground">
              {t("CONNECTIONS_SELECTED_COLUMNS")}
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
