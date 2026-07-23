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

import type { TableProps } from "../../types/tableTypes";

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

  emptyMessage = "No records found",
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

  return (
    <div
      className={`
        w-full
        overflow-auto
        rounded-[var(--radius-sm)]
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        ${className}
      `}
    >
      {/* Toolbar */}

      {filterable && (
        <div className="flex items-center justify-end bg-[var(--color-surface)] px-3 py-2.5">
          <input
            type="text"
            value={globalFilter}
            placeholder="Search..."
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="
              w-[250px]
              rounded-[var(--radius-sm)]
              border
              border-[var(--color-border)]
              bg-[var(--color-background)]
              px-3
              py-2
              text-[var(--text-sm)]
              text-[var(--color-text-primary)]
              outline-none
              transition-colors
              placeholder:text-[var(--color-text-secondary)]
              hover:border-[var(--color-text-secondary)]
              focus:border-[var(--color-primary)]
            "
          />
        </div>
      )}

      {/* Table */}

      <table
        className={`
          w-full
          border-collapse
          table-fixed
          bg-[var(--color-surface)]
          ${tableClassName}
        `}
      >
        <thead className="bg-[var(--color-card)]">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`
                    border
                    border-[var(--color-border)]
                    px-3
                    py-2.5
                    text-left
                    font-[var(--font-semibold)]
                    text-[var(--color-text-primary)]
                    whitespace-nowrap
                    ${
                      stickyHeader
                        ? "sticky top-0 z-10 bg-[var(--color-card)]"
                        : ""
                    }
                  `}
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex flex-col gap-1.5">
                      {/* Header */}

                      <div
                        className={`${
                          sortable && header.column.getCanSort()
                            ? "cursor-pointer select-none hover:text-[var(--color-primary)]"
                            : ""
                        }`}
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

                        {sortable && header.column.getIsSorted() && (
                          <span className="ml-1 text-xs">
                            {header.column.getIsSorted() === "asc" ? "▲" : "▼"}
                          </span>
                        )}
                      </div>

                      {/* Column Filter */}

                      {filterable && header.column.getCanFilter() && (
                        <input
                          placeholder="Filter..."
                          value={
                            (header.column.getFilterValue() as string) ?? ""
                          }
                          onChange={(e) =>
                            header.column.setFilterValue(e.target.value)
                          }
                          className="
                              w-full
                              rounded-[var(--radius-sm)]
                              border
                              border-[var(--color-border)]
                              bg-[var(--color-background)]
                              px-2
                              py-1.5
                              text-[var(--text-xs)]
                              text-[var(--color-text-primary)]
                              outline-none
                              transition-colors
                              placeholder:text-[var(--color-text-secondary)]
                              hover:border-[var(--color-text-secondary)]
                              focus:border-[var(--color-primary)]
                            "
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
                className="
                  border
                  border-[var(--color-border)]
                  px-4
                  py-6
                  text-center
                  text-[var(--color-text-primary)]
                "
              >
                Loading...
              </td>
            </tr>
          ) : table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="
                  border
                  border-[var(--color-border)]
                  px-4
                  py-6
                  text-center
                  text-[var(--color-text-primary)]
                "
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row, rowIndex) => (
              <tr
                key={row.id}
                className={`
                  transition-colors
                  hover:bg-[var(--color-card)]
                  ${
                    zebraStripes
                      ? rowIndex % 2 === 0
                        ? "bg-[var(--color-surface)]"
                        : "bg-[var(--color-card)]"
                      : ""
                  }
                `}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="
                      whitespace-nowrap
                      border
                      border-[var(--color-border)]
                      px-3
                      py-2.5
                      text-[var(--color-text-primary)]
                    "
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
        <div
          className="
            flex items-center justify-between
            border-t border-[var(--color-border)]
            bg-[var(--color-surface)]
            px-3 py-3
          "
        >
          {/* Left */}

          <div className="flex items-center gap-2">
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="
                h-8
                rounded-[var(--radius-sm)]
                border
                border-[var(--color-border)]
                bg-[var(--color-background)]
                px-3
                text-[var(--text-sm)]
                text-[var(--color-text-primary)]
                outline-none
                transition-colors
                hover:border-[var(--color-text-secondary)]
                focus:border-[var(--color-primary)]
              "
            >
              {[10, 20, 30, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>

          {/* Right */}

          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="
                flex h-8 w-8 items-center justify-center
                rounded-[var(--radius-sm)]
                border border-[var(--color-border)]
                bg-[var(--color-background)]
                text-[var(--color-text-primary)]
                transition-colors
                hover:bg-[var(--color-primary)]
                hover:text-white
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {"<<"}
            </button>

            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="
                flex h-8 w-8 items-center justify-center
                rounded-[var(--radius-sm)]
                border border-[var(--color-border)]
                bg-[var(--color-background)]
                text-[var(--color-text-primary)]
                transition-colors
                hover:bg-[var(--color-primary)]
                hover:text-white
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {"<"}
            </button>

            <span className="px-2 text-[var(--text-sm)] text-[var(--color-text-primary)]">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="
                flex h-8 w-8 items-center justify-center
                rounded-[var(--radius-sm)]
                border border-[var(--color-border)]
                bg-[var(--color-background)]
                text-[var(--color-text-primary)]
                transition-colors
                hover:bg-[var(--color-primary)]
                hover:text-white
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {">"}
            </button>

            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="
                flex h-8 w-8 items-center justify-center
                rounded-[var(--radius-sm)]
                border border-[var(--color-border)]
                bg-[var(--color-background)]
                text-[var(--color-text-primary)]
                transition-colors
                hover:bg-[var(--color-primary)]
                hover:text-white
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {">>"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
