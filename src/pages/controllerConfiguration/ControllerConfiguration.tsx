import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

import Button from "../../components/forms/button/Button";
import Input from "../../components/forms/input/Input";
import Checkbox from "../../components/forms/checkbox/CheckBox";
import TextArea from "../../components/forms/textarea/TextArea";

import type {
  ControllerConfigurationProps,
  ControllerConfigurationState,
  TextField,
} from "../../types/ControllerConfigurationTypes";

import {
  controllerFields,
  controllerSampleIntervalOptions,
  controllerStepTitles,
} from "./controllerConfiguration.fields";

const ControllerConfiguration: React.FC<ControllerConfigurationProps> = ({
  onCancel,
  onFinish,
}) => {
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState(1);

  const initialState: ControllerConfigurationState = {
    opMin: "-5",
    pvMin: "0",
    opMax: "105",
    pvMax: "100",
    sampleIntervalType: "average",
    specifiedInterval: "0.00",
    serviceFactorThreshold: "60",
    minimumContiguousSampleCount: "5",
    isSlave: true,
    pvNormalization: "",
    spNormalization: "",
    opNormalization: "",
    aux1Normalization: "",
    aux2Normalization: "",
    aux3Normalization: "",
    inGap: "",
    feedForward: "",
    warningThreshold: "95",
    abortThreshold: "95",
    badPvThreshold: "95",
    weight: "1",
    description: t("CONTROLLER_DEFAULT_DESCRIPTION"),
    allowRobustDiagnostic: true,
    eliminationExpression: "",
    gain: "1",
    derivativeFilter: "0",
    integralTime: "0",
    pvFilter: "0",
    derivativeTime: "0",
    comment: "",
    tuningHistoryDays: "365",
    sensorHighLimit: "100",
    sensorLowLimit: "0",
    freezeDuration: "15",
    acceptableViolation: "90",
    showAdvancedSettings: true,
    maximumMeasurementChange: "10",
    minimumMeasurementChange: "0.01",
  };

  const [formData, setFormData] =
    useState<ControllerConfigurationState>(initialState);

  const totalSteps = 6;
  const stepTitles = controllerStepTitles.map((key) => t(key));

  const updateField = <K extends keyof ControllerConfigurationState>(
    field: K,
    value: ControllerConfigurationState[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetFields = (
    ...fieldsToReset: (keyof ControllerConfigurationState)[]
  ) => {
    const resetValues = Object.fromEntries(
      fieldsToReset.map((field) => [field, initialState[field]]),
    ) as Partial<ControllerConfigurationState>;

    setFormData((prev) => ({
      ...prev,
      ...resetValues,
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    onFinish?.();
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderInputs = (inputFields: TextField[]) =>
    inputFields.map(({ label, field, type }) => (
      <Input
        key={field}
        className="border-0"
        label={t(label)}
        type={type}
        value={formData[field]}
        onChange={(e) => updateField(field, e.target.value)}
      />
    ));

  const renderResettableInputs = (inputFields: TextField[]) =>
    inputFields.map(({ label, field, type }) => (
      <div key={field} className="flex w-full items-end gap-2 px-1">
        <div className="flex-1">
          <Input
            className="h-13 border-0"
            label={t(label)}
            type={type}
            value={formData[field]}
            onChange={(e) => updateField(field, e.target.value)}
          />
        </div>

        <RotateCcw
          className={`resetButtonClass mb-5`}
          cursor={"pointer"}
          size={14}
          strokeWidth={1.8}
          onClick={() => resetFields(field)}
        />
      </div>
    ));

  const sectionClass = `
    rounded-lg
    border
    border-controller-border
    bg-controller-section-background
    p-4
  `;

  const sectionTitleClass = `
    mb-4
    text-xs
    font-medium
    tracking-wide
    text-controller-muted
  `;

  const resetButtonClass = `
    text-controller-reset-foreground
    transition-colors
    hover:text-controller-reset-hover-foreground
  `;

  return (
    <div className="flex w-[670px] min-h-0 flex-1 flex-col text-controller-foreground">
      <div className="shrink-0">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-controller-title">
            {t("CONTROLLER_STEP", {
              current: currentStep,
              total: totalSteps,
            })}{" "}
            - {stepTitles[currentStep - 1]}
          </div>

          <div className="text-xs text-controller-muted">
            {t("CONTROLLER_UNIT")}
          </div>
        </div>

        <div className="mt-3 flex w-full gap-2">
          {stepTitles.map((_, index) => {
            const stepNumber = index + 1;

            const isActive = stepNumber === currentStep;

            const isCompleted = stepNumber < currentStep;

            return (
              <div key={stepNumber} className="flex-1">
                <div
                  className={[
                    "h-1 rounded-full transition-all duration-300",
                    isActive || isCompleted
                      ? "bg-controller-step-active"
                      : "bg-controller-step-inactive",
                  ].join(" ")}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="
          min-h-0
          max-h-[60vh]
          flex-1
          overflow-y-auto
          pt-4
          pr-1
          pb-4
        "
      >
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className={sectionClass}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className={sectionTitleClass}>
                  {t("CONTROLLER_OP_PV_RANGE")}
                </h3>

                <RotateCcw
                  className={resetButtonClass}
                  size={16}
                  cursor="pointer"
                  onClick={() =>
                    resetFields("opMin", "pvMin", "opMax", "pvMax")
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {renderInputs(controllerFields.range)}
              </div>
            </div>

            <div className={sectionClass}>
              <h3 className={sectionTitleClass}>
                {t("CONTROLLER_SAMPLE_INTERVAL")}
              </h3>

              <div className="space-y-4">
                {controllerSampleIntervalOptions.map(({ label, value }) => (
                  <div key={value} className="flex items-center gap-3">
                    <label className="flex shrink-0 items-center gap-3 text-sm text-controller-title">
                      <input
                        type="radio"
                        name="sampleInterval"
                        value={value}
                        checked={formData.sampleIntervalType === value}
                        onChange={() =>
                          updateField("sampleIntervalType", value)
                        }
                        className="
                            h-4
                            w-4
                            accent-controller-radio-accent
                          "
                      />

                      <span>{t(label)}</span>
                    </label>

                    {value === "specified" && (
                      <div className="flex-1">
                        <Input
                          className="border-0"
                          type="number"
                          value={formData.specifiedInterval}
                          onChange={(e) =>
                            updateField("specifiedInterval", e.target.value)
                          }
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={sectionClass}>
              <h3 className={sectionTitleClass}>
                {t("CONTROLLER_SAMPLING_OPTIONS")}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {renderInputs(controllerFields.sampling)}
              </div>
            </div>

            <div className={sectionClass}>
              <Checkbox
                label={t("CONTROLLER_IS_SLAVE")}
                checked={formData.isSlave}
                className="nodrag nopan"
                onClick={(e) => {
                  e.stopPropagation();

                  updateField("isSlave", !formData.isSlave);
                }}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-5">
            <p className="text-xs text-controller-description">
              {t("CONTROLLER_NORMALIZATION_DESCRIPTION")}
            </p>

            {renderResettableInputs(controllerFields.normalization)}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-5">
            <p className="text-xs text-controller-description">
              {t("CONTROLLER_NORMALIZATION_DESCRIPTION")}
            </p>

            {renderResettableInputs(controllerFields.auxiliary)}
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <div className={sectionClass}>
              <h3 className={sectionTitleClass}>
                {t("CONTROLLER_BAD_DATA_OPTIONS")}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {renderInputs(controllerFields.badData)}
              </div>
            </div>

            <div className={sectionClass}>
              <h3 className={sectionTitleClass}>
                {t("CONTROLLER_PLANT_INFORMATION")}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {renderInputs(controllerFields.plantInformation)}
              </div>
            </div>

            <div className={sectionClass}>
              <Checkbox
                label={t("CONTROLLER_ALLOW_ROBUST_DIAGNOSTIC")}
                checked={formData.allowRobustDiagnostic}
                className="nodrag nopan"
                onClick={(e) => {
                  e.stopPropagation();

                  updateField(
                    "allowRobustDiagnostic",
                    !formData.allowRobustDiagnostic,
                  );
                }}
              />
            </div>

            <div className={sectionClass}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className={sectionTitleClass}>
                  {t("CONTROLLER_ELIMINATION_EXPRESSION")}
                </h3>

                <RotateCcw
                  size={16}
                  className={resetButtonClass}
                  cursor="pointer"
                  onClick={() => resetFields("eliminationExpression")}
                />
              </div>

              <TextArea
                className="border-0"
                value={formData.eliminationExpression}
                onChange={(e) =>
                  updateField("eliminationExpression", e.target.value)
                }
              />
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4">
            <div className={sectionClass}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className={sectionTitleClass}>
                  {t("CONTROLLER_TUNING_INFORMATION")}
                </h3>

                <RotateCcw
                  size={16}
                  onClick={() =>
                    resetFields(
                      "gain",
                      "derivativeFilter",
                      "integralTime",
                      "pvFilter",
                      "derivativeTime",
                    )
                  }
                  className={resetButtonClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {renderInputs(controllerFields.tuning)}
              </div>
            </div>

            <div className={sectionClass}>
              <div className="mb-4 flex items-center justify-between">
                <label className="text-sm font-medium text-controller-title">
                  {t("CONTROLLER_COMMENT")}
                </label>

                <RotateCcw
                  size={16}
                  onClick={() => resetFields("comment")}
                  className={resetButtonClass}
                />
              </div>

              <TextArea
                className="border-0"
                value={formData.comment}
                onChange={(e) => updateField("comment", e.target.value)}
              />
            </div>

            <div className={sectionClass}>
              <div className="flex items-end gap-3">
                <div className="w-40">
                  <Input
                    className="border-0"
                    label={t("CONTROLLER_TUNING_HISTORY_DAYS")}
                    type="number"
                    value={formData.tuningHistoryDays}
                    onChange={(e) =>
                      updateField("tuningHistoryDays", e.target.value)
                    }
                  />
                </div>

                <Button type="button" variant="secondary">
                  {t("CONTROLLER_BROWSE_HISTORY")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-4">
            <div className={sectionClass}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className={sectionTitleClass}>
                  {t("CONTROLLER_SENSOR_MAX_MIN")}
                </h3>

                <RotateCcw
                  size={16}
                  className={resetButtonClass}
                  cursor="pointer"
                  onClick={() =>
                    resetFields("sensorHighLimit", "sensorLowLimit")
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {renderInputs(controllerFields.sensorLimits)}
              </div>
            </div>

            <div className={sectionClass}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className={sectionTitleClass}>
                  {t("CONTROLLER_TOLERANCE")}
                </h3>

                <RotateCcw
                  size={16}
                  className={resetButtonClass}
                  cursor={"pointer"}
                  onClick={() =>
                    resetFields("freezeDuration", "acceptableViolation")
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {renderInputs(controllerFields.tolerance)}
              </div>
            </div>

            <div className={sectionClass}>
              <Checkbox
                label={t("CONTROLLER_SHOW_ADVANCED_SETTINGS")}
                checked={formData.showAdvancedSettings}
                className="nodrag nopan"
                onClick={(e) => {
                  e.stopPropagation();

                  updateField(
                    "showAdvancedSettings",
                    !formData.showAdvancedSettings,
                  );
                }}
              />

              {formData.showAdvancedSettings && (
                <div className="rounded-md border border-controller-border p-3 mt-3">
                  <h3 className={sectionTitleClass}>
                    {t("CONTROLLER_ADVANCED_SETTINGS")}
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {renderInputs(controllerFields.advanced)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div
        className="
          flex
          h-[9vh]
          shrink-0
          items-center
          justify-between
          pt-4
          pb-10
        "
      >
        <Button type="button" onClick={handleBack} disabled={currentStep === 1}>
          {t("BUTTON_BACK")}
        </Button>

        <div className="flex gap-3">
          <Button type="button" onClick={onCancel}>
            {t("COMMON_CANCEL")}
          </Button>

          <Button variant="primary" type="button" onClick={handleNext}>
            {currentStep === totalSteps
              ? t("CONTROLLER_FINISH")
              : t("BUTTON_NEXT")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ControllerConfiguration;
