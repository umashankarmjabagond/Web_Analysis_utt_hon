import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronRight, ChevronLeft } from "lucide-react";

import Button from "../../components/forms/button/Button";
import ConnectionTree from "../../components/common/tree/ConnectionTree";

import type { TreeNodeData } from "../../types/commonTypes";

import {
  allColumnsData,
  DEFAULT_SELECTED_COLUMNS,
  buildSelectedTreeFromSource,
  getSelectedTree,
} from "../../utils/utils";

type ConnectionsProps = {
  onClose?: () => void;
};

export default function Connections({
  onClose,
}: ConnectionsProps) {
  const { t } = useTranslation();

  const [leftCheckedIds, setLeftCheckedIds] = useState<string[]>([]);
  const [rightCheckedIds, setRightCheckedIds] = useState<string[]>([]);

  const [selectedColumns, setSelectedColumns] = useState<TreeNodeData[]>(
    DEFAULT_SELECTED_COLUMNS,
  );

  const toggleLeftCheck = (id: string) => {
    setLeftCheckedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id],
    );
  };

  const toggleRightCheck = (id: string) => {
    setRightCheckedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id],
    );
  };

  const moveToSelected = () => {
    setSelectedColumns(
      getSelectedTree(selectedColumns, leftCheckedIds),
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
      buildSelectedTreeFromSource(
        allColumnsData,
        remainingIds,
      ),
    );

    setRightCheckedIds([]);
  };

  return (
    <div className="flex w-full flex-col bg-surface-primary overflow-hidden">
      {/* Content */}
      <div className="flex flex-1 flex-col pt-4 pb-4 min-h-0">
        <p className="mb-6 text-[13px] font-medium leading-[19.5px] tracking-[0px] text-foreground-text">
          {t("CONNECTIONS_SELECT_INPUTS_MESSAGE")}{" "}
          <strong className="text-foreground">
            "{t("CONNECTIONS_DATA_PREPROCESSING")}"
          </strong>{" "}
          {t("CONNECTIONS_TO")}{" "}
          <strong className="text-foreground">
            "{t("FILTER_DATA_SOURCE")}"
          </strong>
          .
        </p>

        {/* Titles */}
        <div className="mb-2 grid grid-cols-[1fr_40px_1fr] gap-6">
          <div>
            <h3 className="text-[12px] font-bold uppercase leading-4 tracking-[0.3px] text-foreground-tertiary">
              {t("CONNECTIONS_DATA_PREPROCESSING")}
            </h3>
          </div>

          <div />

          <div>
            <h3 className="text-[12px] font-bold uppercase leading-4 tracking-[0.3px] text-foreground-tertiary">
              {t("FILTER_DATA_SOURCE")}
            </h3>
          </div>
        </div>

        {/* Panels */}
        <div className="flex h-[258px] gap-6">
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
  className="border border-border-gray bg-background text-control-light hover:border-border-default hover:bg-background active:border-border-default active:bg-background"
  variant="secondary"
  fill="outline"
  iconOnly
  icon={<ChevronRight size={16} />}
  onClick={moveToSelected}
/>

<Button
  className="border border-border-gray bg-background text-control-light hover:border-border-default hover:bg-background active:border-border-default active:bg-background"
  variant="secondary"
  fill="outline"
  iconOnly
  icon={<ChevronLeft size={16} />}
  onClick={removeFromSelected}
/>
</div>

{/* Right Panel */}
<div className="flex-1 overflow-hidden rounded-[6px] border border-border-default pt-[6px] pl-[6px] pb-[6px]">
  <div className="h-full overflow-y-auto py-1">
    <ConnectionTree
      nodes={selectedColumns}
      checkedIds={rightCheckedIds}
      onCheck={toggleRightCheck}
      showCheckbox={true}
    />

    {selectedColumns?.[0]?.children?.[0]?.children?.length === 0 && (
      <div className="ml-[72px] mt-2 text-[12px] font-medium leading-[19.5px] text-muted-foreground">
        None
      </div>
    )}
  </div>
</div>
</div>
</div>

{/* Footer */}
<div className="flex h-[0px] justify-end gap-3 pt-4 pb-10">
  <Button
    variant="secondary"
    fill="outline"
    className="h-[34px] w-[97px]"
    onClick={onClose}
  >
    {t("COMMON_CANCEL")}
  </Button>

  <Button
    variant="primary"
    className="h-[34px] w-[97px]"
  >
    {t("PROJECT_ANALYSIS_FINISH")}
  </Button>
</div>
</div>
);
}