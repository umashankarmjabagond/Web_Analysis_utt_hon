import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  CylinderIcon,
  HelpCircle,
  X,
} from "lucide-react";

import Button from "../forms/button/Button";
import Checkbox from "../forms/checkbox/CheckBox";
import Select from "../forms/select/Select";
import TextArea from "../forms/textarea/TextArea";
import { dataSourceSchema } from "../../schemas/dataSourceSchema";
import { cn } from "../../utils/utils";

import type {
  DataSourceDialogProps,
  FormData,
  OdbcSectionProps,
  RadioProps,
  TextFileSectionProps,
} from "./dataSourceTypes";

/* -------------------------------------------------------------------------- */
/*                                Initial Data                                */
/* -------------------------------------------------------------------------- */

const initialFormData: FormData = {
  dataSource: "",

  file: null,
  fieldSeparator: "",
  rowSeparator: "",
  treatDataAsNumeric: true,
  uniqueId: false,
  header: true,
  timeColumn: "",

  sqlDataSource: "",
  authentication: "trusted",
  username: "",
  password: "",
  transposeOutputData: false,
  directSqlQuery: false,
  sqlQuery: "",
};

/* -------------------------------------------------------------------------- */
/*                                  Styles                                    */
/* -------------------------------------------------------------------------- */

const containerClass = "w-[500px] bg-surface-primary text-foreground";

const contentWidthClass = "w-[420px]";

const labelClass =
  "block h-5 text-[13px] font-bold leading-[19.5px] text-foreground";

const errorClass =
  "mt-[2px] block text-[11px] font-medium leading-[16px] text-red-500";

/* -------------------------------------------------------------------------- */
/*                              Validation Error                              */
/* -------------------------------------------------------------------------- */

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <span className={errorClass} role="alert">
      {message}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Radio Button                                */
/* -------------------------------------------------------------------------- */

function DataSourceRadio({
  name,
  value,
  checked,
  label,
  onChange,
}: RadioProps) {
  return (
    <label className="flex h-[20px] w-[420px] cursor-pointer items-center gap-[8px] text-[13px] font-medium leading-[19.5px]">
      <span className="relative h-[20px] w-[18px] shrink-0 pt-[2px]">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          className="
            peer
            absolute
            inset-0
            z-10
            h-[18px]
            w-[18px]
            cursor-pointer
            appearance-none
            rounded-full
            border-[2px]
            border-foreground-tertiary
            bg-surface-primary
            checked:border-surface-accent
          "
        />

        <span
          className="
            pointer-events-none
            absolute
            left-[5px]
            top-[5px]
            z-20
            hidden
            h-[8px]
            w-[8px]
            rounded-full
            bg-surface-accent
            peer-checked:block
          "
        />
      </span>

      <span>{label}</span>
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Text File Section                              */
/* -------------------------------------------------------------------------- */

function TextFileSection({ formData, onChange, errors }: TextFileSectionProps) {
  const { t } = useTranslation();

  const separatorOptions = [
    { value: ",", label: t("DS_COMMA") },
    { value: ";", label: t("DS_SEMICOLON") },
    { value: "|", label: t("DS_PIPE") },
    { value: "\\t", label: t("DS_TAB") },
  ];

  const rowSeparatorOptions = [
    { value: "\\n", label: t("DS_NEW_LINE") },
    { value: "\\r\\n", label: t("DS_CRLF") },
  ];

  const timeColumnOptions = [
    { value: "1", label: t("DS_COLUMN_1") },
    { value: "2", label: t("DS_COLUMN_2") },
    { value: "3", label: t("DS_COLUMN_3") },
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onChange("file", file);
  };

  const checkboxClassName = `
    rounded-[4px]
    bg-surface-primary
    border-foreground-tertiary
    checked:border-checkbox-checked-border
    checked:bg-checkbox-checked-background
  `;

  const checkboxLabelClassName = `
    text-[13px]
    font-medium
    leading-[19.5px]
    text-foreground-secondary
  `;

  return (
    <div className="flex w-[420px] flex-col gap-[14px]">
      {/* ------------------------------------------------------------------ */}
      {/* Choose File                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex w-[420px] flex-col gap-[6px]">
        <label className={labelClass}>{t("DS_CHOOSE_FILE")}</label>

        {/* File control row */}
        <div className="flex h-[34px] w-[420px] gap-[8px]">
          {/* File Name */}
          <div
            className="
              box-border
              flex
              h-[32px]
              w-[287px]
              items-center
              rounded-[6px]
              border
              border-border-gray
              bg-accordion-background
              px-[10px]
            "
          >
            <span
              className="
                truncate
                text-[13px]
                font-medium
                leading-[32px]
                text-badge-neutral-solid-background
              "
            >
              {formData.file?.name ?? t("DS_NO_FILE_CHOSEN")}
            </span>
          </div>

          {/* Choose File Button */}
          <Button
            type="button"
            variant="primary"
            fill="outline"
            size="medium"
            className="
              w-auto
              rounded-[6px]
              px-[24px]
              py-[6px]
              text-[14px]
              font-bold
              leading-[20px]
            "
            onClick={() => {
              document.getElementById("text-file-input")?.click();
            }}
          >
            {t("DS_CHOOSE_FILE")}
          </Button>

          <input
            id="text-file-input"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Error is OUTSIDE the horizontal row */}
        <FieldError message={errors?.file} />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Field Separator + Row Separator                                   */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid w-[420px] grid-cols-2 gap-[12px]">
        {/* Field Separator */}
        <div className="flex w-[204px] flex-col gap-[4px]">
          <Select
            label={t("DS_FIELD_SEPARATOR")}
            options={separatorOptions}
            placeHolder={t("COMMON_SELECT")}
            value={formData.fieldSeparator}
            onChange={(event) => onChange("fieldSeparator", event.target.value)}
            className="
              h-[32px]
              w-[204px]
              border-border-gray
              bg-accordion-background
              text-badge-neutral-solid-background
            "
          />

          <FieldError message={errors?.fieldSeparator} />
        </div>

        {/* Row Separator */}
        <div className="flex w-[204px] flex-col gap-[4px]">
          <Select
            label={t("DS_ROW_SEPARATOR")}
            options={rowSeparatorOptions}
            placeHolder={t("COMMON_SELECT")}
            value={formData.rowSeparator}
            onChange={(event) => onChange("rowSeparator", event.target.value)}
            className="
              h-[32px]
              w-[204px]
              border-border-gray
              bg-accordion-background
              text-badge-neutral-solid-background
            "
          />

          <FieldError message={errors?.rowSeparator} />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Checkboxes                                                         */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex w-[420px] flex-col gap-[10px]">
        <Checkbox
          checked={formData.treatDataAsNumeric}
          label={t("DS_TREAT_DATA_AS_NUMERIC")}
          size={18}
          onChange={(event) =>
            onChange("treatDataAsNumeric", event.target.checked)
          }
          className={checkboxClassName}
          labelClassName={checkboxLabelClassName}
        />

        <Checkbox
          checked={formData.uniqueId}
          label={t("DS_UNIQUE_ID")}
          size={18}
          onChange={(event) => onChange("uniqueId", event.target.checked)}
          className={checkboxClassName}
          labelClassName={checkboxLabelClassName}
        />

        <Checkbox
          checked={formData.header}
          label={t("DS_HEADER")}
          size={18}
          onChange={(event) => onChange("header", event.target.checked)}
          className={checkboxClassName}
          labelClassName={checkboxLabelClassName}
        />

        <div className="flex w-[420px] flex-col">
          {/* Time Column field row */}
          <div
            className="
      flex
      h-[32px]
      w-[420px]
      items-center
      gap-[12px]
      pl-[24px]
    "
          >
            <label
              className="
        h-[20px]
        w-[80px]
        shrink-0
        text-[13px]
        font-medium
        leading-[19.5px]
        text-foreground-secondary
      "
            >
              {t("DS_TIME_COLUMN")}
            </label>

            {/* Keep Select completely isolated from error */}
            <div className="relative h-[32px] w-[120.5px] shrink-0">
              <Select
                options={timeColumnOptions}
                value={formData.timeColumn}
                onChange={(event) => onChange("timeColumn", event.target.value)}
                className="
          h-[32px]
          w-[120.5px]
          rounded-[6px]
          border-border-gray
          bg-accordion-background
          text-badge-neutral-solid-background
        "
              />
            </div>
          </div>

          {/* Error gets its own row */}
          <div className="ml-[116px] min-h-[16px]">
            <FieldError message={errors?.timeColumn} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              ODBC Section                                  */
/* -------------------------------------------------------------------------- */

function OdbcSection({ formData, onChange, errors }: OdbcSectionProps) {
  const { t } = useTranslation();

  const selectOptions = [
    {
      value: "option1",
      label: t("DS_OPTION_1"),
    },
    {
      value: "option2",
      label: t("DS_OPTION_2"),
    },
  ];

  const [activeAction, setActiveAction] = useState<"add" | "edit" | "remove">(
    "add",
  );

  return (
    <div className="flex w-[420px] flex-col gap-[14px]">
      {/* ------------------------------------------------------------------ */}
      {/* SQL Data Source                                                    */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex w-[420px] flex-col gap-[6px]">
        <label
          className="
            h-[20px]
            text-[13px]
            font-bold
            leading-[19.5px]
            text-foreground
          "
        >
          {t("DS_SQL_DATA_SOURCE")}
        </label>

        <Select
          options={selectOptions}
          placeHolder={t("COMMON_SELECT")}
          value={formData.sqlDataSource}
          onChange={(event) => onChange("sqlDataSource", event.target.value)}
          className="
            h-[32px]
            w-[420px]
            rounded-[6px]
            border
            border-border-gray
            bg-accordion-background
            text-table-header-foreground
          "
        />

        <FieldError message={errors?.sqlDataSource} />

        {/* Add / Edit / Remove */}
        <div className="flex h-[34px] w-[420px] gap-[6px]">
          {/* ADD */}
          <Button
            type="button"
            variant="primary"
            fill="outline"
            size="medium"
            className={`
              h-[34px]
              w-[77px]
              rounded-[6px]
              border
              px-[24px]
              py-[6px]
              text-[14px]
              leading-[20px]
              ${
                activeAction === "add"
                  ? "border-surface-accent bg-surface-elevated text-surface-accent"
                  : "border-border-button bg-surface-elevated text-surface-control"
              }
            `}
            onClick={() => setActiveAction("add")}
          >
            {t("DS_ADD")}
          </Button>

          {/* EDIT */}
          <Button
            type="button"
            variant="primary"
            fill="outline"
            size="medium"
            className={`
              h-[34px]
              w-[77px]
              rounded-[6px]
              border
              px-[24px]
              py-[6px]
              text-[14px]
              leading-[20px]
              ${
                activeAction === "edit"
                  ? "border-surface-accent bg-surface-elevated text-surface-accent"
                  : "border-border-button bg-surface-elevated text-surface-control"
              }
            `}
            onClick={() => setActiveAction("edit")}
          >
            {t("DS_EDIT")}
          </Button>

          {/* REMOVE */}
          <Button
            type="button"
            variant="primary"
            fill="outline"
            size="medium"
            className={`
              h-[34px]
              w-[104px]
              rounded-[6px]
              border
              px-[24px]
              py-[6px]
              text-[14px]
              leading-[20px]
              ${
                activeAction === "remove"
                  ? "border-surface-accent bg-surface-elevated text-surface-accent"
                  : "border-border-button bg-surface-elevated text-surface-control"
              }
            `}
            onClick={() => setActiveAction("remove")}
          >
            {t("DS_REMOVE")}
          </Button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Authentication                                                     */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex h-[76px] w-[420px] flex-col gap-[6px]">
        <p
          className="
            h-[20px]
            text-[13px]
            font-bold
            leading-[19.5px]
            text-foreground
          "
        >
          {t("DS_AUTHENTICATION_MODE")}
        </p>

        <div className="flex h-[50px] flex-col gap-[10px]">
          <DataSourceRadio
            name="authentication"
            value="trusted"
            checked={formData.authentication === "trusted"}
            label={t("DS_TRUSTED_CONNECTION")}
            onChange={(value) =>
              onChange("authentication", value as FormData["authentication"])
            }
          />

          <DataSourceRadio
            name="authentication"
            value="username-password"
            checked={formData.authentication === "username-password"}
            label={t("DS_USERNAME_PASSWORD")}
            onChange={(value) =>
              onChange("authentication", value as FormData["authentication"])
            }
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Username + Password                                                */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid w-[420px] grid-cols-2 gap-[12px]">
        {/* Username */}
        <div className="flex w-[204px] flex-col">
          <label className={labelClass}>{t("DS_USERNAME")}</label>

          <div className="mt-[6px]">
            <input
              type="text"
              placeholder={t("DS_ADD_USERNAME")}
              value={formData.username}
              onChange={(event) => onChange("username", event.target.value)}
              className="
          box-border
          h-[32px]
          w-[204px]
          rounded-[6px]
          border
          border-border-gray
          bg-accordion-background
          px-[10px]
          text-[13px]
          font-medium
          leading-[19.5px]
          text-foreground
          outline-none
          placeholder:text-foreground-tertiary
        "
            />
          </div>

          {/* Dedicated error area */}
          <div className="min-h-[16px]">
            <FieldError message={errors?.username} />
          </div>
        </div>

        {/* Password */}
        <div className="flex w-[204px] flex-col">
          <label className={labelClass}>{t("DS_PASSWORD")}</label>

          <div className="mt-[6px]">
            <input
              type="password"
              placeholder={t("DS_ADD_PASSWORD")}
              value={formData.password}
              onChange={(event) => onChange("password", event.target.value)}
              className="
          box-border
          h-[32px]
          w-[204px]
          rounded-[6px]
          border
          border-border-gray
          bg-accordion-background
          px-[10px]
          text-[13px]
          font-medium
          leading-[19.5px]
          text-foreground-secondary
          outline-none
          placeholder:text-foreground-tertiary
        "
            />
          </div>

          {/* Dedicated error area */}
          <div className="min-h-[16px]">
            <FieldError message={errors?.password} />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Options + SQL Query                                                */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex w-[420px] flex-col gap-[10px]">
        {/* Transpose */}
        <div className="w-[420px]">
          <Checkbox
            checked={formData.transposeOutputData}
            label={t("DS_TRANSPOSE_OUTPUT_DATA")}
            size={18}
            onChange={(event) =>
              onChange("transposeOutputData", event.target.checked)
            }
            className="
              rounded-[4px]
              border-foreground-tertiary
              bg-surface-primary
              checked:border-checkbox-checked-border
              checked:bg-checkbox-checked-background
            "
            labelClassName="
              text-[13px]
              font-medium
              leading-[19.5px]
              text-foreground-secondary
            "
          />
        </div>

        {/* Direct SQL */}
        <div className="w-[420px]">
          <Checkbox
            checked={formData.directSqlQuery}
            label={t("DS_DIRECT_SQL_QUERY")}
            size={18}
            onChange={(event) =>
              onChange("directSqlQuery", event.target.checked)
            }
            className="
              rounded-[4px]
              border-foreground-tertiary
              bg-surface-primary
              checked:border-checkbox-checked-border
              checked:bg-checkbox-checked-background
            "
            labelClassName="
              text-[13px]
              font-medium
              leading-[19.5px]
              text-foreground-secondary
            "
          />
        </div>

        {/* SQL Query */}
        <TextArea
          value={formData.sqlQuery}
          onChange={(event) => onChange("sqlQuery", event.target.value)}
          placeholder={t("DS_SQL_QUERY_PLACEHOLDER")}
          rows={4}
          disabled={!formData.directSqlQuery}
          className="
            h-[92px]
            w-[420px]
            rounded-[6px]
            border
            border-border-gray
            bg-accordion-background
            px-[10px]
            py-[6px]
            text-[13px]
            font-medium
            leading-[19.5px]
            text-foreground-secondary
            placeholder:text-foreground-tertiary
          "
        />

        <FieldError message={errors?.sqlQuery} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Main Component                                */
/* -------------------------------------------------------------------------- */

export default function DataSource({
  type,
  dataSourceName = "HDS2",
  onClose,
  onSave,
  onTypeChange,
}: DataSourceDialogProps) {
  const { t } = useTranslation();

  const selectOptions = [
    {
      value: "option1",
      label: t("DS_OPTION_1"),
    },
    {
      value: "option2",
      label: t("DS_OPTION_2"),
    },
  ];

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  const [helpActive, setHelpActive] = useState(false);

  const isTextFile = type === "text-file";
  const isOdbc = type === "odbc";

  /* ---------------------------------------------------------------------- */
  /*                              Field Change                              */
  /* ---------------------------------------------------------------------- */

  const handleChange = <K extends keyof FormData>(
    key: K,
    value: FormData[K],
  ) => {
    setFormData((previous) => ({
      ...previous,
      [key]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [key]: undefined,
    }));
  };

  /* ---------------------------------------------------------------------- */
  /*                              Save / Validate                           */
  /* ---------------------------------------------------------------------- */

  const handleSave = () => {
    const result = dataSourceSchema.safeParse({
      type,
      ...formData,
    });

    if (!result.success) {
      const validationErrors: Partial<Record<keyof FormData, string>> = {};

      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];

        if (typeof fieldName === "string" && fieldName in initialFormData) {
          const field = fieldName as keyof FormData;

          if (!validationErrors[field]) {
            validationErrors[field] = issue.message;
          }
        }
      });

      setErrors(validationErrors);

      return;
    }

    setErrors({});

    onSave?.({
      type,
      dataSourceName,
      ...formData,
    });
  };

  /* ---------------------------------------------------------------------- */
  /*                                  UI                                    */
  /* ---------------------------------------------------------------------- */

  return (
    <div
      className={cn(
        containerClass,
        "flex flex-col",
        isTextFile ? "min-h-[561px]" : "min-h-[719px]",
      )}
    >
      {/* ================================================================== */}
      {/* Header                                                             */}
      {/* ================================================================== */}

      <div
        className="
          flex
          h-[102px]
          w-[500px]
          shrink-0
          items-start
          gap-[12px]
          px-[40px]
          pb-[16px]
          pt-[40px]
        "
      >
        {/* Icon */}
        <div
          className="
            relative
            flex
            h-[36px]
            w-[36px]
            shrink-0
            items-center
            justify-center
            rounded-[6px]
            border-[1.5px]
            border-border-gray
            bg-accordion-background
          "
        >
          <CylinderIcon
            size={16}
            strokeWidth={1.5}
            className="text-foreground"
          />

          <ArrowRight
            size={7}
            strokeWidth={3.5}
            className="
              absolute
              left-[14px]
              top-[15px]
              text-foreground
            "
          />
        </div>

        {/* Title */}
        <div className="h-[46px] w-auto">
          <h2
            className="
              h-[30px]
              w-[29px]
              text-[20px]
              font-extrabold
              leading-[30px]
              text-foreground
            "
          >
            {t("DS_DATA_SOURCE")}
          </h2>

          <p
            className="
              h-[16px]
              w-[112px]
              text-[12px]
              font-medium
              leading-[16px]
              text-table-header-foreground
            "
          >
            {t("FILTER_DATA_SOURCE")} · {dataSourceName}
          </p>
        </div>

        {/* Close */}
        <Button
          type="button"
          variant="secondary"
          fill="solid"
          size="small"
          iconOnly
          icon={<X size={14} />}
          aria-label={t("COMMON_CLOSE")}
          onClick={onClose}
          className="
            ml-auto
            h-[32px]
            w-[32px]
            border-0
            bg-transparent
            p-0
            text-[--foreground-tertiary]
            hover:bg-transparent
          "
        />
      </div>

      {/* ================================================================== */}
      {/* Content                                                            */}
      {/* ================================================================== */}

      <div
        className="
          w-[500px]
          shrink-0
          px-[40px]
          py-[16px]
        "
      >
        <div className={cn(contentWidthClass, "flex flex-col gap-[14px]")}>
          {/* Select Data Source */}
          <div className="flex w-[420px] flex-col gap-[6px]">
            <label
              className="
                h-[20px]
                text-[13px]
                font-bold
                leading-[19.5px]
                text-foreground
              "
            >
              {t("DS_SELECT_DATA_SOURCE")}
            </label>

            <Select
              options={selectOptions}
              placeHolder={t("COMMON_SELECT")}
              value={formData.dataSource}
              onChange={(event) =>
                handleChange("dataSource", event.target.value)
              }
              className="
                h-[32px]
                w-[420px]
                rounded-[6px]
                border
                border-border-gray
                bg-accordion-background
                text-foreground-tertiary
              "
            />

            <FieldError message={errors?.dataSource} />
          </div>

          {/* Text File */}
          {isTextFile && (
            <TextFileSection
              formData={formData}
              onChange={handleChange}
              errors={errors}
            />
          )}

          {/* ODBC */}
          {isOdbc && (
            <OdbcSection
              formData={formData}
              onChange={handleChange}
              errors={errors}
            />
          )}
        </div>
      </div>

      {/* ================================================================== */}
      {/* Footer                                                             */}
      {/* ================================================================== */}

      {/* ================================================================== */}
      {/* Footer                                                             */}
      {/* ================================================================== */}

      <div
        className="
    flex
    min-h-[90px]
    w-[500px]
    shrink-0
    items-center
    justify-between
    px-[40px]
    pb-[40px]
    pt-[16px]
  "
      >
        {/* Help */}
        <Button
          type="button"
          variant="primary"
          fill={helpActive ? "solid" : "outline"}
          size="medium"
          icon={<HelpCircle size={14} />}
          onClick={() => setHelpActive((previous) => !previous)}
          className="
      h-[34px]
      w-[94px]
      rounded-[6px]
      px-[16px]
    "
        >
          {t("COMMON_HELP")}
        </Button>

        {/* Previous / Next */}
        <div className="flex items-center gap-[8px]">
          {/* Previous - ODBC -> Text File */}
          {isOdbc && (
            <Button
              type="button"
              variant="secondary"
              fill="outline"
              size="small"
              iconOnly
              icon={<ArrowLeft size={16} />}
              aria-label="Previous data source"
              onClick={() => onTypeChange?.("text-file")}
              className="
          h-[34px]
          w-[34px]
          rounded-[6px]
          p-0
        "
            />
          )}

          {/* Next - Text File -> ODBC */}
          {isTextFile && (
            <Button
              type="button"
              variant="secondary"
              fill="outline"
              size="small"
              iconOnly
              icon={<ArrowRight size={16} />}
              aria-label="Next data source"
              onClick={() => onTypeChange?.("odbc")}
              className="
          h-[34px]
          w-[34px]
          rounded-[6px]
          p-0
        "
            />
          )}
        </div>

        {/* Cancel + Save */}
        <div className="flex h-[34px] gap-[8px]">
          <Button
            type="button"
            variant="primary"
            fill="outline"
            size="medium"
            onClick={onClose}
            className="
        h-[34px]
        w-[97px]
        rounded-[6px]
        px-[24px]
      "
          >
            {t("COMMON_CANCEL")}
          </Button>

          <Button
            type="button"
            variant="primary"
            fill="solid"
            size="medium"
            onClick={handleSave}
            className="
        h-[32px]
        w-[81px]
        rounded-[6px]
        px-[24px]
      "
          >
            {t("COMMON_SAVE")}
          </Button>
        </div>
      </div>
    </div>
  );
}
