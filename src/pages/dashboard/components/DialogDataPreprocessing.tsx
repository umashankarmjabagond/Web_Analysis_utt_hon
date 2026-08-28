import { useState } from "react";
import { CircleHelp, Grid2x2, RotateCw } from "lucide-react";
import { useTranslation } from "react-i18next";

import Dialog from "../../../components/common/dialogue/Dialog";
import Button from "../../../components/forms/button/Button";
import Input from "../../../components/forms/input/Input";
import TextArea from "../../../components/forms/textarea/TextArea";
import { cn } from "../../../utils/utils";
import type { DialogDataPreprocessingProps } from "../../../types/commonTypes";

const columns = [
  { key: "MODE", label: "Mode (.MODE)" },
  { key: "OP", label: "OP (.OP)" },
  { key: "PV", label: "PV (.PV)" },
  { key: "SP", label: "SP (.SP)" },
  { key: "REQ", label: "Required Flag (.REQ)" },
  { key: "TM", label: "Test (.TM)" },
];

const DialogDataPreprocessing = ({
  isOpen,
  onClose,
}: DialogDataPreprocessingProps) => {
  const { t } = useTranslation();

  const [selectedColumn, setSelectedColumn] = useState<string>("MODE");
  const [warningThreshold, setWarningThreshold] = useState<string>("");
  const [abortThreshold, setAbortThreshold] = useState<string>("");
  const [badDataExpression, setBadDataExpression] = useState<string>("");
  const [replacementExpression, setReplacementExpression] =
    useState<string>("");

  const [isBadDataRefreshing, setIsBadDataRefreshing] = useState(false);
  const [isReplacementRefreshing, setIsReplacementRefreshing] = useState(false);

  const selectedColumnLabel = columns.find(
    (column) => column.key === selectedColumn,
  )!.label;
  const handleApplyToAll = () => {};

  const handleSave = () => {
    onClose();
  };

  const handleRefreshBadData = () => {
    setIsBadDataRefreshing(true);
    setBadDataExpression("");

    setTimeout(() => {
      setIsBadDataRefreshing(false);
    }, 2000);
  };

  const handleRefreshReplacement = () => {
    setIsReplacementRefreshing(true);
    setReplacementExpression("");

    setTimeout(() => {
      setIsReplacementRefreshing(false);
    }, 2000);
  };

  return (
    <Dialog
      isOpen={isOpen}
      title={t("Data Preprocessing (DPP)")}
      icon={<Grid2x2 size={14} strokeWidth={2} className="text-foreground" />}
      width={750}
      onClose={onClose}
      headerClassName="px-6 py-4"
      titleClassName="text-[15px] font-semibold leading-5 tracking-normal"
    >
      <div className="flex w-full items-stretch gap-5">
        <div className="flex w-[224px] flex-none shrink-0 flex-col gap-2">
          <p className="w-[224px] break-words text-xs font-medium leading-5 text-foreground">
            {t("PROPERTIES_EDIT_COLUMNS_EXPRESSIONS")}
          </p>

          <div className="h-full w-[224px] flex-1 overflow-hidden rounded-[5px] border border-table-border">
            <div className="h-full overflow-y-auto [scrollbar-width:none] [-ms-ovwqwq;;erflow-style:none] [&::-webkit-scrollbar]:hidden">
              {columns.map((column) => {
                const isSelected = selectedColumn === column.key;

                return (
                  <button
                    key={column.key}
                    type="button"
                    onClick={() => setSelectedColumn(column.key)}
                    className={`flex w-full items-center justify-between border-b border-table-border px-3 py-2 text-left last:border-b-0 ${
                      isSelected ? "bg-surface-hover" : "bg-transparent"
                    }`}
                  >
                    <span
                      className={`min-w-0 truncate text-[13px] font-medium leading-[19.5px] ${
                        isSelected
                          ? "text-accordion-list-count"
                          : "text-foreground-secondary"
                      }`}
                    >
                      {column.label}
                    </span>

                    {isSelected && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        className="ml-2 shrink-0 text-accordion-list-count"
                      >
                        <path
                          d="M2 6L4.8 8.8L10 3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-px flex-none shrink-0 self-stretch bg-table-border" />

        <div className="flex w-[401px] min-w-0 flex-none shrink-0 flex-col gap-3 pr-1">
          <p className="w-full break-words text-xs font-medium leading-4 text-foreground">
            {t("PROPERTIES_EDIT_EXPRESSIONS")}
          </p>

          <div className="rounded-[6px] border border-table-border px-3 py-2">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.3px] text-foreground-tertiary">
              SELECTED COLUMN
            </p>
            <span className="text-[13px] font-semibold text-accordion-list-count">
              {selectedColumnLabel}
            </span>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3px] text-foreground-tertiary">
              {t("PROPERTIES_THRESHOLD")}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label={t("PROPERTIES_WARNING_THRESHOLD")}
                placeholder={t("Enter")}
                value={warningThreshold}
                onChange={(event) => setWarningThreshold(event.target.value)}
              />

              <Input
                label={t("PROPERTIES_ABORT_THRESHOLD")}
                placeholder={t("Enter")}
                value={abortThreshold}
                onChange={(event) => setAbortThreshold(event.target.value)}
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3px] text-foreground-tertiary">
              {t("PROPERTIES_EXPRESSION")}
            </p>

            <div className="mb-4">
              <div className="flex items-start gap-2">
                <TextArea
                  label={t("PROPERTIES_BAD_DATA_EXPRESSION")}
                  placeholder={t("PROPERTIES_BAD_DATA_EXPRESSION_PLACEHOLDER")}
                  value={badDataExpression}
                  onChange={(event) => setBadDataExpression(event.target.value)}
                  rows={3}
                  className="h-[81px]"
                />

                <RotateCw
                  size={16}
                  strokeWidth={2}
                  className={cn(
                    "mt-6 cursor-pointer",
                    isBadDataRefreshing
                      ? "pointer-events-none animate-spin"
                      : "hover:rotate-90",
                  )}
                  onClick={handleRefreshBadData}
                  aria-label={t("PROPERTIES_REFRESH_BAD_DATA_EXPRESSION")}
                />
              </div>
            </div>

            <div>
              <div className="flex items-start gap-2">
                <TextArea
                  label={t("PROPERTIES_REPLACEMENT_EXPRESSION")}
                  placeholder={t("Enter")}
                  value={replacementExpression}
                  onChange={(event) =>
                    setReplacementExpression(event.target.value)
                  }
                  rows={4}
                  className="h-[100px]"
                />

                <RotateCw
                  size={16}
                  strokeWidth={2}
                  className={cn(
                    "mt-6 cursor-pointer",
                    isReplacementRefreshing
                      ? "pointer-events-none animate-spin"
                      : "hover:rotate-90",
                  )}
                  onClick={handleRefreshReplacement}
                  aria-label={t("PROPERTIES_REFRESH_REPLACEMENT_EXPRESSION")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex w-full shrink-0 items-center justify-between">
        <Button
          size="small"
          variant="secondary"
          icon={<CircleHelp size={16} strokeWidth={1.5} />}
          className="h-[34px] gap-1.5 rounded-[6px] pl-4 pr-6"
        >
          {t("COMMON_HELP")}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            size="small"
            variant="secondary"
            onClick={handleApplyToAll}
            className="h-[34px] min-w-[97px] gap-1.5 rounded-[6px] px-6"
          >
            {t("COMMON_APPLY_TO_ALL")}
          </Button>

          <Button
            size="small"
            variant="secondary"
            onClick={onClose}
            className="h-[34px] min-w-[80px] gap-1.5 rounded-[6px] px-6"
          >
            {t("COMMON_CANCEL")}
          </Button>

          <Button
            size="small"
            variant="primary"
            onClick={handleSave}
            className="h-[32px] min-w-[81px] gap-1.5 rounded-[6px] px-6"
          >
            {t("COMMON_SAVE")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default DialogDataPreprocessing;
