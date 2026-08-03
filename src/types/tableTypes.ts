import type { ColumnDef, RowData } from "@tanstack/react-table";

export interface TableProps<T extends RowData> {
  data: T[];
  columns?: ColumnDef<T>[];
  sortable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  selectable?: boolean;
  loading?: boolean;
  stickyHeader?: boolean;
  zebraStripes?: boolean;
  className?: string;
  tableClassName?: string;
  emptyMessage?: string;
}
