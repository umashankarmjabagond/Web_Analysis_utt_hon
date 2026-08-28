import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import dataSourceConfiguration from "../../mock/dataSource.json";
import {
  ArrowRight,
  CylinderIcon,
  HelpCircle,
  Plus,
  Settings,
  X,
} from "lucide-react";

import Button from "../forms/button/Button";
import Select from "../forms/select/Select";
import { cn } from "../../utils/utils";

import type { DataSourceDialogProps, FormData } from "./dataSourceTypes";

type ControllerType = "regulatory" | "mpc";

type TemplateType =
  | "standalone-controller"
  | "cascade"
  | "instrument"
  | "analyzers"
  | "rmpct"
  | "dmc"
  | "generic-apc"
  | "inferentials";

type TagDefinition = {
  id: string;
  columnName: string;
  extension: string;
};

type TagDefinitions = Record<ControllerType, Record<string, TagDefinition[]>>;

type SelectedTag = {
  name: string;
  extension: string;
  isManual: boolean;
};

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

  errors: {},
};

export default function DataSource({
  dataSourceName = "HDS2",
  onClose,
  onSave,
}: DataSourceDialogProps) {
  console.log("dataSourceConfiguration", dataSourceConfiguration);
  const { t } = useTranslation();

  const [helpActive, setHelpActive] = useState(false);

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [selectedDataSource, setSelectedDataSource] = useState("none");

  const [controllerType, setControllerType] =
    useState<ControllerType>("regulatory");
  const [templateType, setTemplateType] = useState<TemplateType>(
    "standalone-controller",
  );

  const controllerOptions =
    dataSourceConfiguration.dataSourceConfiguration.controllerTypes.map(
      (controller) => ({
        value: controller.id,
        label: controller.name,
      }),
    );

  const dataSourceOptions =
    dataSourceConfiguration.dataSourceConfiguration.dataSources.map(
      (dataSource) => ({
        value: dataSource.id,
        label: dataSource.name,
      }),
    );

  const templateOptions =
    dataSourceConfiguration.dataSourceConfiguration.templateTypes[
      controllerType as keyof typeof dataSourceConfiguration.dataSourceConfiguration.templateTypes
    ]?.map((template) => ({
      value: template.id,
      label: template.name,
    })) ?? [];

  const tagDefinitions = dataSourceConfiguration.dataSourceConfiguration
    .tagDefinitions as Partial<TagDefinitions>;

  const availableTags =
    tagDefinitions[controllerType]?.[templateType]?.map((tag) => ({
      name: tag.columnName,
      extension: tag.extension,
    })) ?? [];

  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([]);

  const unselectedTags = availableTags.filter(
    (availableTag) =>
      !selectedTags.some(
        (selectedTag) => selectedTag.name === availableTag.name,
      ),
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setFormData((prev) => ({
        ...prev,
        file: null,
      }));

      setSelectedTags([]);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      file,
    }));

    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result;

      if (typeof content !== "string") {
        setSelectedTags([]);
        return;
      }

      // Get the first non-empty line from the text file
      const firstLine = content
        .split(/\r?\n/)
        .find((line) => line.trim().length > 0);

      if (!firstLine) {
        setSelectedTags([]);
        return;
      }

      /*
       * Your actual file is TAB separated.
       *
       * Example:
       *
       * Timestamp    BK-3BFC0126.MODE    BK-3BFC0126.OP
       *              ↑                    ↑
       *              tab                  tab
       */

      const fileColumns = firstLine
        .replace(/^\uFEFF/, "")
        .split(/\t/)
        .map((column) =>
          column
            .trim()
            .replace(/^["']|["']$/g, "")
            .trim(),
        )
        .filter(Boolean);

      console.log("File columns:", fileColumns);
      console.log("Available JSON tags:", availableTags);

      /*
       * Map the file columns with JSON tag definitions.
       *
       * File:
       * BK-3BFC0126.MODE
       *
       * JSON:
       * Mode -> .MODE
       *
       * So we extract:
       * .MODE
       *
       * and compare it with JSON extension.
       */

      const mappedTags: SelectedTag[] = fileColumns
        .map((fileColumn) => {
          // Timestamp is not a tag, so ignore it
          if (fileColumn.toLowerCase() === "timestamp") {
            return null;
          }

          /*
           * Get everything after the last dot.
           *
           * BK-3BFC0126.MODE
           *              ↓
           * .MODE
           *
           * BK-3BFC0126.OP
           *              ↓
           * .OP
           */
          const lastDotIndex = fileColumn.lastIndexOf(".");

          if (lastDotIndex === -1) {
            return null;
          }

          const extension = fileColumn
            .substring(lastDotIndex)
            .trim()
            .toLowerCase();

          console.log(
            `File column "${fileColumn}" has extension "${extension}"`,
          );

          /*
           * Find matching JSON definition.
           *
           * JSON:
           * {
           *   columnName: "Mode",
           *   extension: ".MODE"
           * }
           *
           * extension comparison:
           * ".mode" === ".mode"
           */
          const matchedTag = availableTags.find(
            (tag) => tag.extension.trim().toLowerCase() === extension,
          );

          console.log(`Column "${fileColumn}" =>`, matchedTag ?? "NO MATCH");

          if (!matchedTag) {
            return null;
          }

          return {
            name: matchedTag.name,
            extension: matchedTag.extension,
            isManual: false,
          };
        })
        .filter((tag): tag is SelectedTag => tag !== null);

      console.log("Final mapped tags:", mappedTags);

      setSelectedTags(mappedTags);
    };

    reader.onerror = () => {
      console.error("Failed to read file");
      setSelectedTags([]);
    };

    reader.readAsText(file);
  };

  const handleRemoveTag = (index: number) => {
    setSelectedTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = (name: string, extension: string) => {
    setSelectedTags((prev) => {
      const alreadySelected = prev.some((tag) => tag.name === name);

      if (alreadySelected) {
        return prev;
      }

      return [
        ...prev,
        {
          name,
          extension,
          isManual: false,
        },
      ];
    });
  };

  const handleAddManualTag = () => {
    setSelectedTags((prev) => [
      ...prev,
      {
        name: "",
        extension: "",
        isManual: true,
      },
    ]);
  };
  const handleManualTagChange = (
    index: number,
    field: "name" | "extension",
    value: string,
  ) => {
    setSelectedTags((prev) =>
      prev.map((tag, i) =>
        i === index
          ? {
              ...tag,
              [field]: value,
            }
          : tag,
      ),
    );
  };

  const handleAddAllTags = () => {
    setSelectedTags((prev) => {
      const existingNames = new Set(prev.map((tag) => tag.name));

      const newTags = availableTags
        .filter((tag) => !existingNames.has(tag.name))
        .map((tag) => ({
          name: tag.name,
          extension: tag.extension,
          isManual: false,
        }));

      return [...prev, ...newTags];
    });
  };
  const handleSave = () => {
    onSave?.({
      ...formData,
      selectedDataSource,
      controllerType,
      templateType,
      selectedTags,
    });
  };

  return (
    <div
      className={cn(
        "w-[1280px] rounded-[8px] bg-surface-primary text-foreground",
        "flex flex-col",
        selectedDataSource === "none"
          ? "h-[776.89px]"
          : "min-h-[486px] max-h-[776.89px] h-auto",
      )}
    >
      {/* HEADER */}
      <div className="flex items-start px-[36px] pt-[32px]">
        {" "}
        <div className=" relative flex h-[36px] w-[36px] items-center justify-center rounded-[6px] border border-border-gray bg-accordion-background ">
          {" "}
          <CylinderIcon size={16} strokeWidth={1.5} />
          <ArrowRight
            size={7}
            strokeWidth={3}
            className="absolute left-[14px] top-[15px]"
          />{" "}
        </div>
        <div className="ml-[14px]">
          {" "}
          <h2 className="text-[18px] font-bold">Data Source (DS)</h2>
          <p className="text-[12px] text-table-header-foreground">
            {" "}
            Data Source · {dataSourceName}{" "}
          </p>{" "}
        </div>
        <div className="ml-auto flex gap-[12px]">
          {" "}
          <button>
            {" "}
            <Settings size={14} />{" "}
          </button>
          <button onClick={onClose}>
            {" "}
            <X size={14} />{" "}
          </button>{" "}
        </div>{" "}
      </div>
      {/* BODY */}
      <div
        className={cn(
          "flex gap-[20px] px-[36px] py-[24px]",
          selectedDataSource === "none" ? "flex-1 min-h-0" : "h-auto",
        )}
      >
        {" "}
        {/* LEFT SECTION */}
        <div className="flex w-0 flex-1 min-h-0 flex-col gap-[16px]">
          {" "}
          <div>
            {" "}
            <label className="mb-[6px] block text-[13px] font-bold">
              {" "}
              Select Data Source{" "}
            </label>
            <Select
              options={dataSourceOptions}
              value={selectedDataSource}
              onChange={(event) => {
                setSelectedDataSource(event.target.value);
              }}
              className="h-[34px] w-full rounded-[6px] border-border-gray"
            />
          </div>
          {selectedDataSource === "testfile" && (
            <div>
              {" "}
              <label className="mb-[6px] block text-[13px] font-bold">
                {" "}
                Text File{" "}
              </label>
              <div className="flex items-center gap-[10px]">
                {" "}
                <Button
                  type="button"
                  variant="primary"
                  fill="outline"
                  size="small"
                  onClick={() =>
                    document.getElementById("browse-file")?.click()
                  }
                >
                  {" "}
                  Browse File{" "}
                </Button>
                <span className="text-[13px]">
                  {" "}
                  {formData.file?.name ?? "No file selected"}{" "}
                </span>
                <input
                  id="browse-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />{" "}
              </div>{" "}
            </div>
          )}
          <div>
            {" "}
            <label className="mb-[6px] block text-[13px] font-bold">
              {" "}
              Controller Type{" "}
            </label>
            <Select
              options={controllerOptions}
              value={controllerType}
              onChange={(event) => {
                const newControllerType = event.target.value as ControllerType;

                setControllerType(newControllerType);

                const templates =
                  dataSourceConfiguration.dataSourceConfiguration.templateTypes[
                    newControllerType
                  ];

                setTemplateType(
                  (templates?.[0]?.id as TemplateType) ??
                    "standalone-controller",
                );

                // Clear tags from previous controller
                setSelectedTags([]);
              }}
              className="h-[34px] w-full rounded-[6px] border-border-gray"
            />
          </div>
          {/* TEMPLATE TYPE */}
          <div>
            <label className="mb-[6px] block text-[13px] font-bold">
              Template Type
            </label>

            <Select
              options={templateOptions}
              value={templateType}
              onChange={(event) => {
                const newTemplateType = event.target.value as TemplateType;

                setTemplateType(newTemplateType);

                // Clear tags from previous template
                setSelectedTags([]);
              }}
              className="h-[34px] w-full rounded-[6px] border-border-gray"
            />
          </div>
          {/* SELECT TAGS - HIDDEN FOR TEXT FILE */}
          {selectedDataSource !== "testfile" && (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="mb-[6px] flex items-center justify-between">
                <label className="text-[13px] font-bold">Select Tags</label>

                <button
                  type="button"
                  className="text-[12px] text-surface-accent"
                  onClick={handleAddAllTags}
                >
                  Add All
                </button>
              </div>

              <div
                className="
    min-h-0
    flex-1
    overflow-y-auto
    rounded-[6px]
    border
    border-border-gray
    p-[10px]
  "
              >
                <div
                  className="
          mb-[8px]
          grid
          grid-cols-[1fr_110px_40px]
          gap-[8px]
          text-[11px]
          font-bold
        "
                >
                  <div>COLUMN NAME</div>
                  <div>EXTENSIONS</div>
                  <div />
                </div>

                {unselectedTags.map((tag) => (
                  <div
                    key={tag.name}
                    className="
            mb-[8px]
            grid
            grid-cols-[1fr_110px_40px]
            gap-[8px]
          "
                  >
                    <input
                      value={tag.name}
                      readOnly
                      className="
              h-[32px]
              rounded-[4px]
              border
              border-border-gray
              bg-accordion-background
              px-[8px]
            "
                    />

                    <input
                      value={tag.extension}
                      readOnly
                      className="
              h-[32px]
              rounded-[4px]
              border
              border-border-gray
              bg-accordion-background
              px-[8px]
            "
                    />

                    <button
                      type="button"
                      className="
    flex
    h-[32px]
    w-[32px]
    items-center
    justify-center
    rounded-[4px]
    border
    border-border-gray
    hover:border-surface-accent
  "
                      onClick={() => handleAddTag(tag.name, tag.extension)}
                    >
                      <Plus
                        size={14}
                        strokeWidth={1.5}
                        className="text-foreground hover:text-surface-accent"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* RIGHT SECTION */}
        <div
          className={cn(
            "flex w-0 flex-1 flex-col",
            selectedDataSource === "none" ? "min-h-0" : "h-auto",
          )}
        >
          {/* HEADER - OUTSIDE BORDER */}
          <div className="mb-[8px] flex items-center justify-between">
            <h3 className="text-[13px] font-bold">Selected Tags</h3>

            <button
              type="button"
              className="text-[12px] font-semibold text-surface-accent"
              onClick={() => setSelectedTags([])}
            >
              Remove All
            </button>
          </div>

          {/* BORDERED CONTENT */}
          <div
            className={cn(
              "flex flex-col rounded-[6px] border border-border-gray p-[12px] bg-[#2e2e2e4d]",
              selectedDataSource === "none"
                ? "h-[562.89px]"
                : "min-h-[272px] max-h-[562.89px] h-auto",
            )}
          >
            {/* COLUMN HEADERS */}
            <div
              className="
      grid
      grid-cols-[1fr_140px_40px]
      gap-[8px]
      px-[4px]
      text-[11px]
      font-bold
      text-foreground-secondary
    "
            >
              <div>COLUMN NAME</div>
              <div>EXTENSIONS</div>
              <div />
            </div>

            {/* SELECTED TAGS */}
            <div className="mt-[8px] min-h-0 flex-1 overflow-y-auto">
              {selectedTags.length === 0 ? (
                <div className="flex min-h-[160px] -mt-[58px] items-center justify-center">
                  <div
                    className="
            flex
            h-[34px]
            
            w-full
            italic
            items-center
            justify-start
            rounded-[6px]
            border
            border-dashed
            border-border-gray
            px-[20px]
            text-[13px]
            text-foreground-secondary

          "
                  >
                    No extensions selected.
                  </div>
                </div>
              ) : (
                selectedTags.map((tag, index) => (
                  <div
                    key={`${tag.name}-${index}`}
                    className="
            mb-[8px]
            grid
            grid-cols-[1fr_140px_40px]
            gap-[8px]
          "
                  >
                    {/* COLUMN NAME */}
                    <input
                      value={tag.name}
                      placeholder={tag.isManual ? "Column name" : undefined}
                      readOnly={!tag.isManual}
                      onChange={(event) =>
                        handleManualTagChange(index, "name", event.target.value)
                      }
                      className={cn(
                        "h-[32px] rounded-[4px] border border-border-gray px-[10px] text-[13px] outline-none",
                        tag.isManual
                          ? "bg-accordion-background placeholder:text-foreground-secondary focus:border-surface-accent"
                          : "bg-accordion-background",
                      )}
                    />

                    {/* EXTENSION */}
                    <input
                      value={tag.extension}
                      placeholder={tag.isManual ? ".PV" : undefined}
                      readOnly={!tag.isManual}
                      onChange={(event) =>
                        handleManualTagChange(
                          index,
                          "extension",
                          event.target.value,
                        )
                      }
                      className={cn(
                        "h-[32px] rounded-[4px] border border-border-gray px-[10px] text-[13px] outline-none",
                        tag.isManual
                          ? "bg-accordion-background placeholder:text-foreground-secondary focus:border-surface-accent"
                          : "bg-accordion-background",
                      )}
                    />
                    {/* REMOVE */}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="
    flex
    h-[32px]
    w-[32px]
    items-center
    justify-center
    rounded-[4px]
    border
    border-border-gray
    bg-accordion-background
    hover:border-button-danger-solid-active-border
  "
                    >
                      <X
                        size={14}
                        strokeWidth={1.5}
                        className="text-foreground hover:text-button-danger-solid-active-border"
                      />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* ADD MANUALLY */}
            <div className="mt-[12px] border-t border-border-gray pt-[12px]">
              <Button
                type="button"
                variant="primary"
                fill="outline"
                size="medium"
                onClick={handleAddManualTag}
              >
                Add Tag Manually
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* FOOTER */}
      <div className=" flex items-center justify-between px-[36px] pb-[28px] pt-[16px] ">
        {" "}
        <Button
          type="button"
          variant="primary"
          fill={helpActive ? "solid" : "outline"}
          size="medium"
          icon={<HelpCircle size={14} />}
          onClick={() => setHelpActive((prev) => !prev)}
        >
          {" "}
          {t("COMMON_HELP")}{" "}
        </Button>
        <div className="flex gap-[8px]">
          {" "}
          <Button
            type="button"
            variant="primary"
            fill="outline"
            size="medium"
            onClick={onClose}
          >
            {" "}
            {t("COMMON_CANCEL")}{" "}
          </Button>
          <Button
            type="button"
            variant="primary"
            fill="solid"
            size="medium"
            onClick={handleSave}
          >
            {" "}
            {t("COMMON_SAVE")}{" "}
          </Button>
        </div>{" "}
      </div>{" "}
    </div>
  );
}
