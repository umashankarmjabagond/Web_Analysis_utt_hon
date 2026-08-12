import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../components/forms/button/Button";
import Input from "../../components/forms/input/Input";
import Select from "../../components/forms/select/Select";
import TextArea from "../../components/forms/textarea/TextArea";
import { Check, CircleHelp, RotateCw } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  propertiesSchema,
  type PropertiesFormData,
} from "../../schemas/propertiesSchema";
import type { PropertiesProps } from "../../types/workFlowTypes";

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

const Properties: React.FC<PropertiesProps> = ({ onCancel }) => {
  const { t } = useTranslation();
  const [badExpressionLoading, setBadExpressionLoading] = useState(false);

  const [replacementExpressionLoading, setReplacementExpressionLoading] =
    useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<PropertiesFormData>({
    mode: "onChange",
    defaultValues: {
      warningThreshold: "10",
      abortThreshold: "20",
      referenceColumn: "mode",
      badDataExpression: "",
      replacementExpression: "",
    },
  });

  const referenceColumn = watch("referenceColumn");

  const handleBadExpressionRefresh = () => {
    setBadExpressionLoading(true);
    setTimeout(() => {
      setBadExpressionLoading(false);
    }, 2000);
  };

  const handleReplacementRefresh = () => {
    setReplacementExpressionLoading(true);

    setTimeout(() => {
      setReplacementExpressionLoading(false);
    }, 2000);
  };

  const handleSave = (data: PropertiesFormData) => {
    const result = propertiesSchema.safeParse(data);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        setError(issue.path[0] as keyof PropertiesFormData, {
          message: issue.message,
        });
      });

      return;
    }
  };

  return (
    <div className="flex h-full flex-col bg-panel-bg">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex flex-col">
          <span className="text-xl font-semibold text-text-accent">
            {t("PROPERTIES_DATA_PREPROCESSING_WIZARD")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="medium"
            icon={<CircleHelp size={13} strokeWidth={2.2} />}
          >
            {t("COMMON_HELP")}
          </Button>

          <Button variant="secondary" size="medium">
            {t("COMMON_APPLY_TO_ALL")}
          </Button>

          <Button
            variant="primary"
            size="medium"
            onClick={handleSubmit(handleSave)}
          >
            {t("COMMON_SAVE")}
          </Button>
        </div>
      </div>

      {/* Body */}

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}

        <div className="flex w-[320px] flex-col border-r border-border-1">
          <div className="px-4 py-3">
            <span className="text-base font-semibold leading-8 text-text-accent">
              {t("PROPERTIES_EDIT_COLUMNS_EXPRESSIONS")}
            </span>
          </div>

          <div className="flex flex-1 flex-col pt-2">
            {COLUMN_OPTIONS.map((column) => {
              const selected = referenceColumn === column.value;

              return (
                <div key={column.value} className="px-4 py-1">
                  <button
                    onClick={() => setValue("referenceColumn", column.value)}
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
              {t("PROPERTIES_EDIT_EXPRESSION")}
            </span>
          </div>
          {/* Threshold */}

          <div className="flex flex-col gap-3 py-3">
            <span className="text-m font-bold uppercase tracking-[2px] text-text-accent">
              {t("PROPERTIES_THRESHOLD")}
            </span>

            <div className="grid grid-cols-2 gap-6">
              <Input
                label={t("PROPERTIES_WARNING_THRESHOLD")}
                error={errors.warningThreshold?.message}
                {...register("warningThreshold")}
              />

              <Input
                label={t("PROPERTIES_ABORT_THRESHOLD")}
                error={errors.abortThreshold?.message}
                {...register("abortThreshold")}
              />
            </div>
          </div>

          {/* Expression */}

          <div className="mt-8 flex flex-col gap-3">
            <span className="text-m font-bold uppercase tracking-[2px] text-text-accent">
              {t("PROPERTIES_EXPRESSION")}
            </span>

            <div className="flex items-center gap-5">
              <span className="w-[170px] text-sm font-medium text-text-accent">
                {t("PROPERTIES_REFERENCE_COLUMN")}
              </span>

              <div className="flex-1">
                <Select
                  options={COLUMN_OPTIONS}
                  {...register("referenceColumn")}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <TextArea
                  label={t("PROPERTIES_BAD_DATA_EXPRESSION")}
                  placeholder={t("PROPERTIES_BAD_DATA_EXPRESSION_PLACEHOLDER")}
                  rows={5}
                  {...register("badDataExpression")}
                />
              </div>

              <RotateCw
                aria-label={t("PROPERTIES_REFRESH_BAD_DATA_EXPRESSION")}
                role="button"
                tabIndex={0}
                strokeWidth={2}
                onClick={handleBadExpressionRefresh}
                className={`
    mt-7
    cursor-pointer
    transition-transform
    ${
      badExpressionLoading
        ? "animate-spin pointer-events-none"
        : "hover:rotate-90"
    }
  `}
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <TextArea
                  label={t("PROPERTIES_REPLACEMENT_EXPRESSION")}
                  placeholder={t(
                    "PROPERTIES_REPLACEMENT_EXPRESSION_PLACEHOLDER",
                  )}
                  rows={5}
                  {...register("replacementExpression")}
                />
              </div>

              <RotateCw
                aria-label={t("PROPERTIES_REFRESH_REPLACEMENT_EXPRESSION")}
                role="button"
                tabIndex={0}
                strokeWidth={2}
                onClick={handleReplacementRefresh}
                className={`
    mt-7
    cursor-pointer
    transition-transform
    ${
      replacementExpressionLoading
        ? "animate-spin pointer-events-none"
        : "hover:rotate-90"
    }
  `}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}

      <div className="flex items-center justify-end gap-3 border-t border-border-1 px-6 py-4">
        <Button variant="secondary" onClick={onCancel}>
          {t("COMMON_CANCEL")}
        </Button>

        <Button variant="primary" onClick={handleSubmit(handleSave)}>
          {t("COMMON_SAVE")}
        </Button>
      </div>
    </div>
  );
};

export default Properties;
