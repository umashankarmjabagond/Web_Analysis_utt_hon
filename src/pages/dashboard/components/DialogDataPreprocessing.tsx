import { useState } from "react";
import { CircleHelp, Grid2x2, RotateCw } from "lucide-react";
import { useTranslation } from "react-i18next";

import Dialog from "../../../components/common/dialogue/Dialog";
import Button from "../../../components/forms/button/Button";
import Input from "../../../components/forms/input/Input";
import TextArea from "../../../components/forms/textarea/TextArea";
import Select from "../../../components/forms/select/Select";
import { cn } from "../../../utils/utils";

interface DialogDataPreprocessingProps {
  isOpen: boolean;
  onClose: () => void;
}

const columns = [
  "HDS2.MODE",
  "HDS2.OP",
  "HDS2.PV",
  "HDS2.SP",
  "01-LC200.MODE",
  "01-LC200.OP",
  "01-LC200.PV",
  "01-LC200.SP",
  "02-PC237.MODE",
  "02-PC237.OP",
  "02-PC237.PV",
  "02-PC237.SP",
  "03-TC274.MODE",
  "03-TC274.OP",
  "03-TC274.PV",
  "03-TC274.SP",
];

const DialogDataPreprocessing = ({
  isOpen,
  onClose,
}: DialogDataPreprocessingProps) => {
  const { t } = useTranslation();

  const [selectedColumn, setSelectedColumn] = useState<string>("HDS2.MODE");
  const [warningThreshold, setWarningThreshold] = useState<string>("100");
  const [abortThreshold, setAbortThreshold] = useState<string>("100");
  const [referenceColumn, setReferenceColumn] = useState<string>("HDS2.MODE");
  const [badDataExpression, setBadDataExpression] = useState<string>("");
  const [replacementExpression, setReplacementExpression] =
    useState<string>("");

  const [isBadDataRefreshing, setIsBadDataRefreshing] = useState(false);
  const [isReplacementRefreshing, setIsReplacementRefreshing] = useState(false);

  const groupPrefix = selectedColumn.split(".")[0];

  const handleApplyToAll = () => {};
  const handleSave = () => {
    // TODO: Save DPR configuration
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
      title={t("DPR_TITLE", "DPR")}
      subtitle={`${t("DPR_SUBTITLE", "Data Preprocessing")} · ${groupPrefix}`}
      icon={<Grid2x2 size={16} strokeWidth={2} className="text-foreground" />}
      width={750}
      onClose={onClose}
      variant="connections"
    >
      <div className="flex w-full items-start gap-5">
        {/* LEFT PANEL */}
        <div className="flex w-[224px] flex-none shrink-0 flex-col gap-2">
          <p className="w-[224px] break-words text-xs font-medium leading-5 text-foreground">
            {t("PROPERTIES_EDIT_COLUMNS_EXPRESSIONS")}
          </p>

          <div className="h-[619px] w-[224px] flex-none overflow-hidden rounded-[5px] border border-table-border">
            <div className="h-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {columns.map((column) => {
                const isSelected = selectedColumn === column;

                return (
                  <button
                    key={column}
                    type="button"
                    onClick={() => setSelectedColumn(column)}
                    className={`flex w-[214px] items-center justify-between border-b border-table-border px-3 py-2 text-left last:border-b-0 ${
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
                      {column}
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

        <div className="h-[619px] w-px flex-none shrink-0 self-stretch bg-table-border" />

        {/* RIGHT PANEL */}
        <div className="flex w-[401px] min-w-0 flex-none shrink-0 flex-col gap-3 pt-4">
          <p className="w-full break-words text-xs font-medium leading-4 text-foreground">
            {t("PROPERTIES_EDIT_EXPRESSIONS")}
          </p>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3px] text-foreground-tertiary">
              {t("PROPERTIES_THRESHOLD", "Threshold")}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label={t("PROPERTIES_WARNING_THRESHOLD", "Warning Threshold %")}
                value={warningThreshold}
                onChange={(event) => setWarningThreshold(event.target.value)}
              />

              <Input
                label={t("PROPERTIES_ABORT_THRESHOLD", "Abort Threshold %")}
                value={abortThreshold}
                onChange={(event) => setAbortThreshold(event.target.value)}
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3px] text-foreground-tertiary">
              {t("PROPERTIES_EXPRESSION", "Expression")}
            </p>

            <div className="mb-4">
              <label className="mb-1 block text-xs font-medium leading-4 text-foreground">
                {t("PROPERTIES_REFERENCE_COLUMN", "Reference Column")}
              </label>
              <Select
                value={referenceColumn}
                onChange={(event) => setReferenceColumn(event.target.value)}
                options={columns.map((column) => ({
                  value: column,
                  label: column,
                }))}
                fullWidth
              />
            </div>

            <div className="mb-4">
              <div className="flex items-start gap-2">
                <TextArea
                  label={t(
                    "PROPERTIES_BAD_DATA_EXPRESSION",
                    "Bad Data Expression",
                  )}
                  placeholder={t(
                    "PROPERTIES_BAD_DATA_EXPRESSION_PLACEHOLDER",
                    "Enter bad data expression...",
                  )}
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
                />
              </div>
            </div>

            <div>
              <div className="flex items-start gap-2">
                <TextArea
                  label={t(
                    "PROPERTIES_REPLACEMENT_EXPRESSION",
                    "Replacement Expression",
                  )}
                  placeholder={t(
                    "PROPERTIES_REPLACEMENT_EXPRESSION_PLACEHOLDER",
                    "Enter replacement expression...",
                  )}
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
        >
          {t("COMMON_HELP", "Help")}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            size="small"
            variant="secondary"
            onClick={handleApplyToAll}
            className="!min-w-[112px]"
          >
            {t("COMMON_APPLY_TO_ALL", "Apply to All")}
          </Button>

          <Button
            size="small"
            variant="secondary"
            onClick={onClose}
            className="!min-w-[80px]"
          >
            {t("COMMON_CANCEL", "Cancel")}
          </Button>

          <Button
            size="small"
            variant="primary"
            onClick={handleSave}
            className="!min-w-[70px]"
          >
            {t("COMMON_SAVE", "Save")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default DialogDataPreprocessing;
