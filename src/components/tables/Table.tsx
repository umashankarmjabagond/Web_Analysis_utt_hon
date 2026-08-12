import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import type { TableProps } from "../../types/tableTypes";
import { cn } from "../../utils/utils";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
} from "lucide-react";
import Select from "../forms/select/Select";

const Table = <T extends object>({
  data,
  columns = [],

  sortable = false,
  filterable = false,
  pagination = false,
  loading = false,

  stickyHeader = false,
  zebraStripes = false,

  className = "",
  tableClassName = "",

  emptyMessage,
}: TableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,

    state: {
      sorting,
      columnFilters,
      globalFilter,
    },

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,

    getCoreRowModel: getCoreRowModel(),

    ...(sortable && {
      getSortedRowModel: getSortedRowModel(),
    }),

    ...(filterable && {
      getFilteredRowModel: getFilteredRowModel(),
    }),

    ...(pagination && {
      getPaginationRowModel: getPaginationRowModel(),
    }),
  });
  const { t } = useTranslation();

  const paginationButtonClass = cn(
    "flex h-8 w-8 items-center justify-center",
    "rounded-sm border",
    "border-table-grid-border",
    "bg-table-background",
    "text-sm text-table-row-foreground",
    "transition-colors",
    "hover:bg-table-row-hover-background",
    "hover:text-table-row-selected-foreground",
    "focus:outline-none",
    "focus:ring-1 focus:ring-table-focus-ring",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
  );

  return (
    <div
      className={cn(
        "w-full overflow-auto rounded-lg border",
        "border-table-border",
        "bg-table-background",
        className,
      )}
    >
      {/* ---------------- Toolbar ---------------- */}
      {filterable && (
        <div
          className={cn(
            "flex items-center justify-end px-3 py-2.5",
            "bg-table-header-background",
            "border-b border-table-header-border",
          )}
        >
          <input
            type="text"
            value={globalFilter}
            placeholder={t("COMMON_SEARCH")}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className={cn(
              "w-[250px] rounded-sm border",
              "border-table-grid-border",
              "bg-table-row-odd-background",
              "px-3 py-2",
              "text-sm text-table-row-foreground",
              "placeholder:text-foreground-placeholder",
              "outline-none transition-colors",
              "hover:border-border-default",
              "focus:border-border-accent",
              "focus:ring-1 focus:ring-table-focus-ring",
            )}
          />
        </div>
      )}

      {/*---------------- Table ----------------*/}
      <table
        className={cn("w-full table-fixed border-collapse", tableClassName)}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={cn(
                    "border px-3 py-2.5",
                    "border-table-header-border",
                    "bg-table-header-background",
                    "text-left text-sm font-semibold",
                    "text-table-header-foreground",
                    "whitespace-nowrap",
                    stickyHeader &&
                      "sticky top-0 z-10 bg-table-sticky-background",
                  )}
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex flex-col gap-1.5">
                      {/* Header */}

                      <div
                        className={cn(
                          sortable &&
                            header.column.getCanSort() &&
                            "cursor-pointer select-none hover:text-foreground-accent",
                        )}
                        onClick={
                          sortable
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}

                        {sortable &&
                          header.column.getIsSorted() &&
                          (header.column.getIsSorted() === "asc" ? (
                            <ChevronUp
                              size={14}
                              className="ml-1 inline text-table-sort-icon-active"
                            />
                          ) : (
                            <ChevronDown
                              size={14}
                              className="ml-1 inline text-table-sort-icon-active"
                            />
                          ))}
                      </div>

                      {/* Column Filter */}
                      {filterable && header.column.getCanFilter() && (
                        <input
                          placeholder={t("COMMON_FILTER")}
                          value={
                            (header.column.getFilterValue() as string) ?? ""
                          }
                          onChange={(e) =>
                            header.column.setFilterValue(e.target.value)
                          }
                          className={cn(
                            "w-full rounded-sm border",
                            "border-table-grid-border",
                            "bg-table-row-odd-background",
                            "px-2 py-1.5",
                            "text-xs text-table-row-foreground",
                            "placeholder:text-foreground-placeholder",
                            "outline-none transition-colors",
                            "hover:border-border-default",
                            "focus:border-border-accent",
                            "focus:ring-1 focus:ring-table-focus-ring",
                          )}
                        />
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className={cn(
                  "border px-4 py-6 text-center",
                  "border-table-grid-border",
                  "bg-table-row-odd-background",
                  "text-table-row-foreground",
                )}
              >
                {t("COMMON_LOADING")}
              </td>
            </tr>
          ) : table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className={cn(
                  "border px-4 py-6 text-center",
                  "border-table-grid-border",
                  "bg-table-background",
                  "text-table-row-foreground",
                )}
              >
                {emptyMessage || t("TABLE_NO_RECORDS_FOUND")}
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row, rowIndex) => (
              <tr
                key={row.id}
                className={cn(
                  "transition-colors",
                  "hover:bg-table-row-hover-background",
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn(
                      "whitespace-nowrap border px-3 py-2.5 text-sm",
                      "border-table-grid-border",
                      "text-table-row-foreground",
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ---------------- Pagination ---------------- */}
      {pagination && (
        <div className="flex items-center justify-between border-t px-3 py-3 border-table-header-border bg-table-background">
          {/* Left */}
          <div className="flex items-center gap-2">
            {/* <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className={cn(
                "h-8 rounded-sm border",
                "border-table-grid-border",
                "bg-table-row-odd-background",
                "px-3",
                "text-sm text-table-row-foreground",
                "outline-none transition-colors",
                "hover:border-border-default",
                "focus:border-border-accent",
                "focus:ring-1 focus:ring-table-focus-ring",
              )}
            >
              {[10, 20, 30, 50].map((size) => (
                <option key={size} value={size}>
                  {t("TABLE_SHOW")} {size}
                </option>
              ))}
            </select> */}

            {/* reused componnet */}
            <Select
              value={String(table.getState().pagination.pageSize)}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              options={[10, 20, 30, 50].map((size) => ({
                value: String(size),
                label: `Show ${size}`,
              }))}
              fullWidth={false}
            />
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className={paginationButtonClass}
            >
              <ChevronsLeft size={16} />
            </button>

            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={paginationButtonClass}
            >
              <ChevronLeft size={16} />
            </button>

            <span className="px-2 text-sm text-table-row-foreground">
              {t("TABLE_PAGE")} {table.getState().pagination.pageIndex + 1}{" "}
              {t("TABLE_OF")} {table.getPageCount()}
            </span>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={paginationButtonClass}
            >
              <ChevronRight size={16} />
            </button>

            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className={paginationButtonClass}
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
