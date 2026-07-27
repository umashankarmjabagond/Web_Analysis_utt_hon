import { createColumnHelper } from "@tanstack/react-table";
import Table from "./Table";

interface StatusSummaryRow {
  unitName: string;
  totalControllers: number;
  good: number;
  warning: number;
  error: number;
}

const data: StatusSummaryRow[] = [
  {
    unitName: "PBG1",
    totalControllers: 12,
    good: 8,
    warning: 2,
    error: 2,
  },
  {
    unitName: "PBG1",
    totalControllers: 16,
    good: 13,
    warning: 2,
    error: 1,
  },
  {
    unitName: "PBG2",
    totalControllers: 10,
    good: 8,
    warning: 1,
    error: 1,
  },
  {
    unitName: "PBG2",
    totalControllers: 20,
    good: 16,
    warning: 2,
    error: 2,
  },
  {
    unitName: "PBG3",
    totalControllers: 14,
    good: 11,
    warning: 2,
    error: 1,
  },
];

const columnHelper = createColumnHelper<StatusSummaryRow>();

const columns = [
  columnHelper.accessor("unitName", {
    header: "Unit Name",
  }),

  columnHelper.accessor("totalControllers", {
    header: "Total Controllers",
    cell: ({ getValue }) => (
      <div className="text-center font-medium">{getValue()}</div>
    ),
  }),

  columnHelper.accessor("good", {
    header: "Good",
    cell: ({ getValue }) => (
      <div className="flex justify-center">
        <span className="rounded-full border border-[var(--color-success)] px-3 py-1 text-xs font-semibold text-[var(--color-success)]">
          {getValue()}
        </span>
      </div>
    ),
  }),

  columnHelper.accessor("warning", {
    header: "Warnings",
    cell: ({ getValue }) => (
      <div className="flex justify-center">
        <span className="rounded-full border border-[var(--color-warning)] px-3 py-1 text-xs font-semibold text-[var(--color-warning)]">
          {getValue()}
        </span>
      </div>
    ),
  }),

  columnHelper.accessor("error", {
    header: "Errors",
    cell: ({ getValue }) => (
      <div className="flex justify-center">
        <span className="rounded-full border border-[var(--color-danger)] px-3 py-1 text-xs font-semibold text-[var(--color-danger)]">
          {getValue()}
        </span>
      </div>
    ),
  }),
];

export default function StatusSummaryTable() {
  return (
    <div
      className="
        flex
        h-[344px]
       
        flex-col
        gap-4
        rounded-[6px]
        border-[0.5px]
        border-[var(--color-button-text-primary)]
        bg-[var(--background-primary-container)]
        px-[24px]
        py-[16px]
        shadow-[1px_1px_1px_0px_#00000026]
      "
    >
      <h2
        className="
          h-[24px]
          w-[290px]
          text-xs
          font-semibold
          uppercase
          tracking-widest
          text-[var(--color-text-accent)]
          leading-6
        "
      >
        Unit Wise Status Summary
      </h2>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <Table columns={columns} data={data} stickyHeader zebraStripes />
      </div>
    </div>
  );
}
