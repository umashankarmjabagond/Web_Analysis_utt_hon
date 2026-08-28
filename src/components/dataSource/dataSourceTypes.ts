
export interface DataSourceDialogProps {
  dataSourceName?: string;
  onClose?: () => void;
  onSave?: (data: unknown) => void;
}

export interface FormData {
  dataSource: string;

  // Text File
  file: File | null;
  fieldSeparator: string;
  rowSeparator: string;
  treatDataAsNumeric: boolean;
  uniqueId: boolean;
  header: boolean;
  timeColumn: string;
}

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