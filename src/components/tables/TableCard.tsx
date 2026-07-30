import Table from "./Table";
import type { RowData } from "@tanstack/react-table";

import type { TableCardProps } from "../../types/dashboardTypes";

function TableCard<T extends RowData>({
  title,
  columns,
  data,
  badge,
  height = "h-full",
  border = "border-[var(--component-card-border)]",
  headerActions,
  className = "",
}: TableCardProps<T>) {
  return (
    <div
      className={`
        flex
        ${height}
        w-full
        min-w-0
        flex-col
        gap-4
        overflow-hidden
        rounded-[6px]
        border-[0.5px]
        ${border}
        bg-[var(--background-primary-container)]
        px-[24px]
        py-[16px]
        shadow-[1px_1px_1px_0px_#00000026]
        ${className}
      `}
    >
      {/* Header */}
      <div className="w-full min-w-0 overflow-x-auto no-scrollbar">
        <div className="flex h-[28px]  min-w-max  items-center gap-5">
          {/* Title + Badge */}

          <div className="flex items-center gap-4 shrink-0">
            <h2
              className="
              h-[24px]
              whitespace-nowrap
              text-[16px]
              font-semibold
              uppercase
              tracking-[2px]
              leading-[24px]
              whitespace-nowrap
              text-[var(--text-text-primary)]
            "
            >
              {title}
            </h2>

            {badge !== undefined && (
              <span
                className="
                flex
                h-[24px]
                w-[36px]
                shrink-0
                items-center
                justify-center
                rounded-[16px]
                bg-[var(--semantic-bad)]
                px-[7.5px]
                py-[2px]
                text-[12px]
                font-medium
                leading-[20px]
                text-white
              "
              >
                {badge}
              </span>
            )}
          </div>

          {/* Dynamic Filters */}

          {headerActions && (
            <div className="flex whitespace-nowrap items-center gap-4 ">
              {headerActions}
            </div>
          )}
        </div>
      </div>

      {/* Table */}

      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
        "
      >
        <Table columns={columns} data={data} stickyHeader zebraStripes />
      </div>
    </div>
  );
}

export default TableCard;
