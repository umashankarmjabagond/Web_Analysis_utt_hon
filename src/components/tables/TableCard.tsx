import Table from "./Table";
import type { TableCardProps } from "../../types/dashboardTypes";
import { cn } from "../../utils/utils";
import Badge from "../common/badge/Badge";
function TableCard<T extends object>({
  title,
  columns,
  data,
  badge,
  height = "h-full",
  border = "border-transparent",
  headerActions,
  className = "",
}: TableCardProps<T>) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col gap-4 overflow-hidden",
        "rounded-sm border",
        "bg-surface-elevated",
        "px-6 py-4",
        "shadow-200",
        border,
        height,
        className,
      )}
    >
      {/* Header */}
      <div className="w-full min-w-0 overflow-x-auto no-scrollbar">
        <div className="flex h-7  min-w-max  items-center gap-5">
          {/* Title + Badge */}
          <div className="flex items-center gap-4 shrink-0">
            <h2 className="whitespace-nowrap text-base font-semibold uppercase leading-6 tracking-[2px] text-foreground">
              {title}
            </h2>

            {badge !== undefined && <Badge variant="danger">{badge}</Badge>}
          </div>

          {/* Dynamic Filters / Header Actions */}
          {headerActions && (
            <div className="flex whitespace-nowrap items-center gap-4 ">
              {headerActions}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Table<T> columns={columns} data={data} stickyHeader zebraStripes />
      </div>
    </div>
  );
}

export default TableCard;
