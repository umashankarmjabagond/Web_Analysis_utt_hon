import { useState } from "react";
import { CircleHelp, RotateCw } from "lucide-react";
import { useTranslation } from "react-i18next";

import Dialog from "../../../components/common/dialogue/Dialog";
import Button from "../../../components/forms/button/Button";

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

  const [selectedColumn, setSelectedColumn] =
    useState<string>("HDS2.MODE");

  const [warningThreshold, setWarningThreshold] =
    useState<string>("100");

  const [abortThreshold, setAbortThreshold] =
    useState<string>("100");

  const [referenceColumns, setReferenceColumns] =
    useState<string>("");

  const [badDataExpression, setBadDataExpression] =
    useState<string>("");

  const [replacementExpression, setReplacementExpression] =
    useState<string>("");

  const groupPrefix = selectedColumn.split(".")[0];

  const handleResetBadData = () => {
    setBadDataExpression("");
  };

  const handleResetReplacement = () => {
    setReplacementExpression("");
  };

  const handleApplyToAll = () => {
    // TODO: Apply current settings to all columns
  };

  const handleSave = () => {
    // TODO: Save DPR configuration
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      title={
        <span className="flex items-center gap-3">
          {/* DPR Icon */}
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#3A3A3A]">
            <svg
              width="12"
              height="11"
              viewBox="0 0 12 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="5"
                height="4"
                rx="0.5"
                stroke="#F0F0F0"
              />
              <rect
                x="6.5"
                y="0.5"
                width="5"
                height="4"
                rx="0.5"
                stroke="#F0F0F0"
              />
              <rect
                x="0.5"
                y="6.5"
                width="5"
                height="4"
                rx="0.5"
                stroke="#F0F0F0"
              />
              <rect
                x="6.5"
                y="6.5"
                width="5"
                height="4"
                rx="0.5"
                stroke="#F0F0F0"
              />
            </svg>
          </span>

          {/* Title */}
          <span className="flex flex-col leading-tight">
            <span className="text-[20px] font-extrabold leading-[30px] text-dialog-title">
              {t("DPR_TITLE", "DPR")}
            </span>

            <span className="text-[12px] font-medium leading-4 text-[var(--gray-350)]">
              {t("DPR_SUBTITLE", "Data Preprocessing")} · {groupPrefix}
            </span>
          </span>
        </span>
      }
      width={750}
      onClose={onClose}
      variant="connections"
    >
      {/* Main DPR Container */}
      <div className="dark flex h-[520px] flex-col">
        {/* =========================
            BODY
        ========================== */}
        <div className="flex min-h-0 flex-1 items-stretch overflow-hidden">
          {/* =========================
              LEFT PANEL
          ========================== */}
          <div className="flex w-[224px] shrink-0 flex-col">
            {/* Heading */}
            <p className="mb-2 text-xs font-medium leading-4 text-[var(--color-text-primary)]">
              {t(
                "DPR_LEFT_HEADING",
                "Edit the expressions of columns you wish to preprocess",
              )}
            </p>

            {/* Column List */}
            <div className="min-h-0 flex-1 overflow-hidden rounded-[5px] border border-[#4A4A4A]">
              <div className="dpr-scrollbar-hidden h-full overflow-y-auto">
                {columns.map((column) => {
                  const isSelected = selectedColumn === column;

                  return (
                    <button
                      key={column}
                      type="button"
                      onClick={() => setSelectedColumn(column)}
                      className="flex h-[39.5px] w-full items-center justify-between border-b border-[#3F3F3F] px-3 text-left text-[13px] last:border-b-0"
                      style={{
                        backgroundColor: isSelected
                          ? "#30383D"
                          : "transparent",
                        color: isSelected
                          ? "#64C3FF"
                          : "#E4E4E4",
                      }}
                    >
                      <span className="truncate">
                        {column}
                      </span>

                      {isSelected && (
                        <span className="ml-2 shrink-0 font-bold text-[#64C3FF]">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =========================
              DIVIDER
          ========================== */}
          <div className="mx-4 w-px shrink-0 bg-[#454545]" />

          {/* =========================
              RIGHT PANEL
          ========================== */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="dpr-scrollbar-hidden min-w-0 flex-1 overflow-y-auto">
              {/* Heading */}
              <p className="mb-4 text-xs font-medium leading-4 text-[var(--color-text-primary)]">
                {t(
                  "DPR_RIGHT_HEADING",
                  "Edit the expressions you wish to preprocess",
                )}
              </p>

              {/* =========================
                  THRESHOLD
              ========================== */}
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3px] text-[#B5B5B5]">
                {t("DPR_THRESHOLD", "Threshold")}
              </p>

              <div className="mb-5 grid grid-cols-2 gap-3">
                {/* Warning Threshold */}
                <div>
                  <label className="mb-1 block text-xs text-[var(--color-text-primary)]">
                    {t(
                      "DPR_WARNING_THRESHOLD",
                      "Warning Threshold %",
                    )}
                  </label>

                  <input
                    type="text"
                    value={warningThreshold}
                    onChange={(event) =>
                      setWarningThreshold(event.target.value)
                    }
                    className="h-8 w-full rounded-[6px] border border-[#454545] bg-[#2E2E2E] px-2.5 text-[13px] text-[#F0F0F0] outline-none focus:border-[#64C3FF]"
                  />
                </div>

                {/* Abort Threshold */}
                <div>
                  <label className="mb-1 block text-xs text-[var(--color-text-primary)]">
                    {t(
                      "DPR_ABORT_THRESHOLD",
                      "Abort Threshold %",
                    )}
                  </label>

                  <input
                    type="text"
                    value={abortThreshold}
                    onChange={(event) =>
                      setAbortThreshold(event.target.value)
                    }
                    className="h-8 w-full rounded-[6px] border border-[#454545] bg-[#2E2E2E] px-2.5 text-[13px] text-[#F0F0F0] outline-none focus:border-[#64C3FF]"
                  />
                </div>
              </div>

              {/* =========================
                  EXPRESSIONS
              ========================== */}
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3px] text-[#B5B5B5]">
                {t("DPR_EXPRESSIONS", "Expressions")}
              </p>

              {/* Reference Columns */}
              <div className="mb-4">
                <label className="mb-1 block text-xs text-[var(--color-text-primary)]">
                  {t(
                    "DPR_REFERENCE_COLUMNS",
                    "Reference Columns",
                  )}
                </label>

                <select
                  value={referenceColumns}
                  onChange={(event) =>
                    setReferenceColumns(event.target.value)
                  }
                  className="h-8 w-full cursor-pointer rounded-[6px] border border-[#454545] bg-[#2E2E2E] px-2.5 text-[13px] text-[#F0F0F0] outline-none focus:border-[#64C3FF]"
                >
                  <option value="">
                    {t("SELECT_PLACEHOLDER", "Select")}
                  </option>

                  {columns.map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bad Data Expression */}
              <div className="mb-4">
                <label className="mb-1 block text-xs text-[var(--color-text-primary)]">
                  {t(
                    "DPR_BAD_DATA_EXPRESSION",
                    "Bad Data Expression",
                  )}
                </label>

                <div className="flex items-start gap-2">
                  <textarea
                    value={badDataExpression}
                    onChange={(event) =>
                      setBadDataExpression(event.target.value)
                    }
                    rows={3}
                    className="min-h-[66px] flex-1 resize-none rounded-[6px] border border-[#454545] bg-[#2E2E2E] p-2.5 text-[13px] text-[#F0F0F0] outline-none focus:border-[#64C3FF]"
                  />

                  <button
                    type="button"
                    onClick={handleResetBadData}
                    className="flex h-8 w-8 min-w-8 shrink-0 items-center justify-center rounded-[6px] border border-[#454545] bg-transparent p-0"
                  >
                    <RotateCw
                      size={14}
                      strokeWidth={1.5}
                      className="text-[#D0D0D0]"
                    />
                  </button>
                </div>
              </div>

              {/* Replacement Expression */}
              <div>
                <label className="mb-1 block text-xs text-[var(--color-text-primary)]">
                  {t(
                    "DPR_REPLACEMENT_EXPRESSION",
                    "Replacement Expression",
                  )}
                </label>

                <div className="flex items-start gap-2">
                  <textarea
                    value={replacementExpression}
                    onChange={(event) =>
                      setReplacementExpression(event.target.value)
                    }
                    rows={4}
                    className="min-h-[79px] flex-1 resize-none rounded-[6px] border border-[#454545] bg-[#2E2E2E] p-2.5 text-[13px] text-[#F0F0F0] outline-none focus:border-[#64C3FF]"
                  />

                  <button
                    type="button"
                    onClick={handleResetReplacement}
                    className="flex h-8 w-8 min-w-8 shrink-0 items-center justify-center rounded-[6px] border border-[#454545] bg-transparent p-0"
                  >
                    <RotateCw
                      size={14}
                      strokeWidth={1.5}
                      className="text-[#D0D0D0]"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            FOOTER
        ========================== */}
        <div className="flex shrink-0 items-center justify-between pt-3">
          {/* Help */}
          <Button
            size="small"
            variant="secondary"
            icon={
              <CircleHelp
                size={16}
                strokeWidth={1.5}
              />
            }
          >
            {t("COMMON_HELP", "Help")}
          </Button>

          {/* Right Buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="small"
              variant="secondary"
              onClick={handleApplyToAll}
              className="!min-w-[112px]"
            >
              {t("APPLY_TO_ALL", "Apply to All")}
            </Button>

            <Button
              size="small"
              variant="secondary"
              onClick={onClose}
              className="!min-w-[80px]"
            >
              {t("BUTTON_CANCEL", "Cancel")}
            </Button>

            <Button
              size="small"
              variant="primary"
              onClick={handleSave}
              className="!min-w-[70px]"
            >
              {t("BUTTON_SAVE", "Save")}
            </Button>
          </div>
        </div>
      </div>

      {/* Hide Scrollbar */}
      <style>
        {`
          .dpr-scrollbar-hidden {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .dpr-scrollbar-hidden::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
        `}
      </style>
    </Dialog>
  );
};

export default DialogDataPreprocessing;