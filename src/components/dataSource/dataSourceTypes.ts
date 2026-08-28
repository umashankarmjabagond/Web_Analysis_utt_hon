export type DataSourceType = "text-file" | "odbc";

export interface DataSourceDialogProps {
  type: DataSourceType;
  dataSourceName?: string;
  onClose?: () => void;
  onSave?: (data: unknown) => void;
  onTypeChange?: (type: DataSourceType) => void;
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
  

  // ODBC
  sqlDataSource: string;
  authentication: "trusted" | "username-password";
  username: string;
  password: string;
  transposeOutputData: boolean;
  directSqlQuery: boolean;
  sqlQuery: string;
}

export type FormErrors = Partial<Record<keyof FormData, string>>;
export interface TextFileSectionProps {
  formData: FormData;
  onChange: <K extends keyof FormData>(
    key: K,
    value: FormData[K],
  ) => void;
  errors: Partial<Record<keyof FormData, string>>;
  
}

export interface OdbcSectionProps {
  formData: FormData;
  onChange: <K extends keyof FormData>(
    key: K,
    value: FormData[K],
  ) => void;
  errors: Partial<Record<keyof FormData, string>>;
}

export interface RadioProps {
  name: string;
  value: string;
  checked: boolean;
  label: string;
  onChange: (value: string) => void;
}

