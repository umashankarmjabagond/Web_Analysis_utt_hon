import { useState } from "react";

import Button from "../../components/forms/button/Button";
import Input from "../../components/forms/input/Input";
import Select from "../../components/forms/select/Select";
import TextArea from "../../components/forms/textarea/TextArea";
import { Check, CircleHelp, RefreshCw } from "lucide-react";
import IconButton from "../../components/forms/iconbutton/IconButton";

const COLUMN_OPTIONS = [
  {
    label: "01-LC0524.MODE",
    value: "mode",
  },
  {
    label: "01-LC0524.OP",
    value: "op",
  },
  {
    label: "01-LC0524.PV",
    value: "pv",
  },
  {
    label: "01-LC0524.SP",
    value: "sp",
  },
  {
    label: "01-LC0524.STATUS",
    value: "status",
  },
];

const Properties = () => {
  const [warningThreshold, setWarningThreshold] = useState("10");

  const [abortThreshold, setAbortThreshold] = useState("20");

  const [referenceColumn, setReferenceColumn] = useState("mode");

  const [badDataExpression, setBadDataExpression] = useState("");

  const [replacementExpression, setReplacementExpression] = useState("");

  const handleSave = () => {
    console.log({
      warningThreshold,
      abortThreshold,
      referenceColumn,
      badDataExpression,
      replacementExpression,
    });
  };

  const handleHelp = () => {
    console.log("Help");
  };

  const handleApplyToAll = () => {
    console.log("Apply To All");
  };

  return (
    <div className="flex h-full flex-col bg-panel-bg">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex flex-col">
          <span className="text-xl font-semibold text-text-accent">
            Data Preprocessing Wizard
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" 
                size="medium" 
                onClick={handleHelp}
                icon={
        <CircleHelp
            size={13}
            strokeWidth={2.2}
        />
    }>
            Help
          </Button>

          <Button variant="secondary" size="medium" onClick={handleApplyToAll}>
            Apply To All
          </Button>

          <Button variant="primary" size="medium" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>

      {/* Body */}

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}

        <div className="flex w-[320px] flex-col border-r border-border-1">
          <div className="px-4 py-3">
            <span className="text-base font-semibold leading-8 text-text-accent">
              Edit the expressions of columns you wish to preprocess
            </span>
          </div>

          <div className="flex flex-1 flex-col pt-2">
            {COLUMN_OPTIONS.map((column) => {
                const selected = referenceColumn === column.value;

                return (
                    <div key={column.value} className="px-4 py-1">

                    <button
                        onClick={() => setReferenceColumn(column.value)}
                        className={`
                        flex
                        h-11
                        w-full
                        items-center
                        justify-between
                        rounded-sm
                        px-4
                        text-left
                        transition-all
                        ${
                            selected
                            ? "bg-panel-hover shadow-md text-[var(--color-button-primary)]"
                            : "text-text-accent hover:bg-panel-hover/40"
                        }
                        `}
                    >
                        <span>{column.label}</span>

                        {selected && (
                        <Check
                            size={16}
                            className="text-[var(--color-button-primary)]"
                        />
                        )}
                    </button>

                    </div>
                );
                })}
          </div>
        </div>

        {/* Right Panel */}

        <div className="flex flex-1 flex-col overflow-y-auto p-6">

          <div>
            <span className="text-s font-bold text-text-accent">
              Edit the expressions you wish to preprocess
            </span>
          </div>
          {/* Threshold */}

          <div className="flex flex-col gap-3 py-3">
            <span className="text-m font-bold uppercase tracking-[2px] text-text-accent">
              Threshold
            </span>

            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Warning Threshold %"
                value={warningThreshold}
                onChange={(e) => setWarningThreshold(e.target.value)}
              />

              <Input
                label="Abort Threshold %"
                value={abortThreshold}
                onChange={(e) => setAbortThreshold(e.target.value)}
              />
            </div>
          </div>

          {/* Expression */}

          <div className="mt-8 flex flex-col gap-3">
            <span className="text-m font-bold uppercase tracking-[2px] text-text-accent">
              Expression
            </span>

            <div className="flex items-center gap-5">
              <span className="w-[170px] text-sm font-medium text-text-accent">
                Reference Column
              </span>

              <div className="flex-1">
                <Select
                  options={COLUMN_OPTIONS}
                  value={referenceColumn}
                  onChange={(e) => setReferenceColumn(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-end gap-3">
                <div className="flex-1">
                    <TextArea
                    label="Bad Data Expression"
                    placeholder="Enter bad data expression..."
                    rows={5}
                    value={badDataExpression}
                    onChange={(e) => setBadDataExpression(e.target.value)}
                    />
                </div>

                <IconButton
                    icon={<RefreshCw />}
                />
            </div>

            <div className="flex items-end gap-3">
                <div className="flex-1">
                    <TextArea
                    label="Replacement Expression"
                    placeholder="Enter replacement expression..."
                    rows={5}
                    value={replacementExpression}
                    onChange={(e) => setReplacementExpression(e.target.value)}
                    />
                </div>
                
                <IconButton
                    icon={<RefreshCw />}
                />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}

      <div className="flex items-center justify-end gap-3 border-t border-border-1 px-6 py-4">
        <Button variant="secondary" onClick={handleHelp}>
          Cancel
        </Button>

        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default Properties;
