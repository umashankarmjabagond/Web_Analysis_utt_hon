import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

import Button from "../../components/forms/button/Button";
import ConnectionTree from "../../components/common/tree/ConnectionTree";

import { allColumnsData, buildSelectedTreeFromSource } from "../../utils/utils";

type ConnectionsProps = {
  onClose?: () => void;
};

const getAllLeafIds = (nodes: typeof allColumnsData): string[] => {
  const ids: string[] = [];

  const traverse = (items: typeof allColumnsData) => {
    items.forEach((node) => {
      if (node.children?.length) {
        traverse(node.children);
      } else {
        ids.push(node.id);
      }
    });
  };

  traverse(nodes);

  return ids;
};

export default function Connections({ onClose }: ConnectionsProps) {
  const { t } = useTranslation();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allLeafIds = useMemo(() => getAllLeafIds(allColumnsData), []);

  const isAllSelected =
    selectedIds.length === allLeafIds.length && allLeafIds.length > 0;

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const removeSelection = (id: string) => {
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const handleClearAll = () => {
    setSelectedIds([]);
  };

  const handleSelectAll = () => {
    setSelectedIds(allLeafIds);
  };

  const selectedColumns = useMemo(() => {
    return buildSelectedTreeFromSource(allColumnsData, selectedIds);
  }, [selectedIds]);

  return (
    <div className="flex w-full flex-col overflow-hidden bg-surface-primary">
      <div className="flex min-h-0 flex-1 flex-col pt-4 pb-4">
        <p className="mb-6 text-[13px] font-medium leading-[19.5px] tracking-[0px] text-foreground-text">
          {t("CONNECTIONS_MESSAGE_PREFIX")}{" "}
          <strong className="text-foreground">
            "{t("FILTER_DATA_SOURCE")}"
          </strong>{" "}
          {t("CONNECTIONS_MESSAGE_SUFFIX")}{" "}
          <strong className="text-foreground">
            "{t("CONNECTIONS_DATA_PREPROCESSING")}"
          </strong>
          <span className="text-foreground-text">.</span>
        </p>

        {/* Headers */}
        <div className="mb-2 flex items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between min-h-[26px]">
              <h3 className="text-[12px] font-bold leading-4 tracking-[0.3px] text-foreground">
                {t("FILTER_DATA_SOURCE")}
              </h3>

              <div className="min-w-[65px] flex justify-end">
                {allLeafIds.length > 0 && (
                  <button
                    type="button"
                    onClick={isAllSelected ? handleClearAll : handleSelectAll}
                    className="cursor-pointer rounded-sm px-1.5 py-1 text-[12px] font-bold text-accordion-list-count hover:bg-tree-node-hover-background"
                  >
                    {isAllSelected ? "Clear All" : "Select All"}
                  </button>
                )}
              </div>
            </div>

            <p className="text-[12px] text-foreground-tertiary">All outputs</p>
          </div>

          <div className="w-[24px] shrink-0" />

          <div className="flex-1">
            <div className="h-[26px] flex items-center">
              <h3 className="text-[12px] font-bold leading-4 tracking-[0.3px] text-foreground">
                {t("CONNECTIONS_DATA_PREPROCESSING")}
              </h3>
            </div>

            <p className="text-[12px] text-foreground-tertiary">Receives</p>
          </div>
        </div>

        {/* Panels */}
        <div className="flex h-[258px] gap-6">
          {/* Left Panel */}
          <div className="flex min-h-0 flex-1 overflow-hidden rounded-[6px] border border-border-default">
            <div className="h-full w-full min-h-0 overflow-y-auto pt-[6px] pl-[6px] pb-[6px] pr-[6px] py-1">
              {allColumnsData.length === 0 ? (
                <div className="ml-[12px] mt-2 text-[12px] font-medium leading-[19.5px] text-foreground-tertiary">
                  None
                </div>
              ) : (
                <ConnectionTree
                  nodes={allColumnsData}
                  checkedIds={selectedIds}
                  onCheck={toggleSelection}
                  showCheckbox
                  showShared
                />
              )}
            </div>
          </div>

          {/* Center Arrow */}
          <div className="flex shrink-0 items-center justify-center">
            <ArrowRight size={14} className="text-foreground-tertiary" />
          </div>

          {/* Right Panel */}
          <div className="flex-1 overflow-hidden rounded-[6px] border border-border-default">
            <div className="h-full overflow-y-auto pt-[6px] pl-[6px] pb-[6px] pr-[6px] py-1">
              {selectedIds.length === 0 ? (
                <div className="ml-[12px] mt-2 text-[12px] font-medium leading-[19.5px] text-foreground-tertiary">
                  No inputs shared yet.
                </div>
              ) : (
                <ConnectionTree
                  nodes={selectedColumns}
                  checkedIds={selectedIds}
                  onCheck={toggleSelection}
                  showCheckbox={false}
                  rightPanel
                  onRemove={removeSelection}
                />
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

        <Button variant="primary" className="h-[34px] w-[97px]">
          {t("PROJECT_ANALYSIS_FINISH")}
        </Button>
      </div>
    </div>
  );
}
