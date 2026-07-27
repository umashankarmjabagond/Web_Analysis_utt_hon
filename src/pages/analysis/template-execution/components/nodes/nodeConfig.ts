import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Calculator,
  Database,
  Funnel,
} from "lucide-react";

export const NODE_TYPES = [
  {
    type: "dataSource",
    label: "Data Source",
    description: "Reads data from an external source",
    icon: Database,
    category: "Input",
  },
  {
    type: "dataSink",
    label: "Data Sink",
    description: "Writes processed data to a destination",
    icon: ArrowDownToLine,
    category: "Output",
  },
  {
    type: "dataPreprocessing",
    label: "Data Preprocessing",
    description: "Cleans and transforms incoming data",
    icon: Funnel,
    category: "Processing",
  },
  {
    type: "math",
    label: "Math",
    description: "Performs mathematical operations",
    icon: Calculator,
    category: "Processing",
  },
  {
    type: "sorter",
    label: "Sorter",
    description: "Sorts records based on configured fields",
    icon: ArrowUpFromLine,
    category: "Processing",
  },
] as const;
