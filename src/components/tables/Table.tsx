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
import "./Table.css";

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
   <div className={`table-container ${className} dark`}>
      {/* ---------------- Toolbar ---------------- */}

      {filterable && (
        <div className="table-toolbar">
          <input
            type="text"
            value={globalFilter}
            placeholder="Search"
            className="global-filter-input"
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      )}

      {/* ---------------- Table ---------------- */}

      <table
        className={`common-table ${tableClassName}
        ${stickyHeader ? "sticky-header" : ""}
        ${zebraStripes ? "zebra-stripes" : ""}
`}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <div className="th-content">
                      {/* Header */}

                      <div
                        className={
                          sortable && header.column.getCanSort()
                            ? "sortable-header"
                            : ""
                        }
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
                          <span className="sort-indicator">
                            {header.column.getIsSorted() === "asc"
                              ? " ▲"
                              : " ▼"}
                          </span>
                        )}
                      </div>

                      {/* Filter */}

                      {filterable && header.column.getCanFilter() && (
                        <input
                          className="column-filter-input"
                          placeholder="Filter..."
                          value={
                            (header.column.getFilterValue() as string) ?? ""
                          }
                          onChange={(e) =>
                            header.column.setFilterValue(e.target.value)
                          }
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
              <td colSpan={columns.length} className="table-message">
                Loading...
              </td>
            </tr>
          ) : table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-message">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
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
        <div className="pagination-controls">
          {/* Left */}

          <div className="pagination-left">
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[10, 20, 30, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>

          {/* Right */}

          <div className="pagination-right">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </button>

            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </button>

            <span className="page-info">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </button>

            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
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
