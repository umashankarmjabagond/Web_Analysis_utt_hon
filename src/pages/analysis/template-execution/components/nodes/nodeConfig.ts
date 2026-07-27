import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Calculator,
  Database,
  Funnel,
} from "lucide-react";

export type NodeType = keyof typeof NODE_TYPES;

export const NODE_TYPES = {
  dataSource: {
    label: "Data Source",
    description: "Reads data from an external source",
    icon: Database,
    category: "Input",
  },
  dataSink: {
    label: "Data Sink",
    description: "Writes processed data to a destination",
    icon: ArrowDownToLine,
    category: "Output",
  },
  dataPreprocessing: {
    label: "Data Preprocessing",
    description: "Cleans and transforms incoming data",
    icon: Funnel,
    category: "Processing",
  },
  math: {
    label: "Math",
    description: "Performs mathematical operations",
    icon: Calculator,
    category: "Processing",
  },
  sorter: {
    label: "Sorter",
    description: "Sorts records based on configured fields",
    icon: ArrowUpFromLine,
    category: "Processing",
  },
} as const;
