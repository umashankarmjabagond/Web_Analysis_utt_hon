import { createColumnHelper } from "@tanstack/react-table";
import Table from "./Table";

interface WarningRow {
  unitName: string;
  type: string;
  controllerName: string;
  attributeName: string;
  errorMessage: string;
}

const data: WarningRow[] = [
  {
    unitName: "PBG1",
    type: "Regulatory",
    controllerName: "56-FFC618",
    attributeName: "Data Source",
    errorMessage: "Error Message to be displayed here",
  },
  {
    unitName: "PBG1",
    type: "Regulatory",
    controllerName: "56-FFC618",
    attributeName: "Data Sink",
    errorMessage: "Error Message to be displayed here",
  },
  {
    unitName: "PBG2",
    type: "Regulatory",
    controllerName: "56-FFC618",
    attributeName: "Valve Stiction",
    errorMessage: "Error Message to be displayed here",
  },
  {
    unitName: "PBG2",
    type: "Regulatory",
    controllerName: "56-FFC618",
    attributeName: "PBG2",
    errorMessage: "Error Message to be displayed here",
  },
  {
    unitName: "PBG2",
    type: "Regulatory",
    controllerName: "56-FFC618",
    attributeName: "PBG2",
    errorMessage: "Error Message to be displayed here",
  },
  {
    unitName: "PBG2",
    type: "MPC",
    controllerName: "56-FFC618",
    attributeName: "PBG2",
    errorMessage: "Error Message to be displayed here",
  },
  {
    unitName: "PBG2",
    type: "MPC",
    controllerName: "56-FFC618",
    attributeName: "PBG2",
    errorMessage: "Error Message to be displayed here",
  },
  {
    unitName: "PBG2",
    type: "MPC",
    controllerName: "56-FFC618",
    attributeName: "PBG2",
    errorMessage: "Error Message to be displayed here",
  },
  {
    unitName: "PBG2",
    type: "MPC",
    controllerName: "56-FFC618",
    attributeName: "PBG2",
    errorMessage: "Error Message to be displayed here",
  },
];

const columnHelper = createColumnHelper<WarningRow>();

const columns = [
  columnHelper.accessor("unitName", {
    header: "Unit Name",
  }),

  columnHelper.accessor("type", {
    header: "Type",
  }),

  columnHelper.accessor("controllerName", {
    header: "Controller Name",

    cell: ({ getValue }) => (
      <span className="text-[var(--color-primary)]">{getValue()}</span>
    ),
  }),

  columnHelper.accessor("attributeName", {
    header: "Attribute Name",
  }),

  columnHelper.accessor("errorMessage", {
    header: "Error Message",
  }),
];

export default function WarningTable() {
  return (
    <div
      className="
    flex
    h-[486px]
    w-full
    flex-col
    gap-4
    overflow-hidden
    rounded-[6px]
    border-[0.5px]
    border-[var(--component-card-border)]
    bg-[var(--background-primary-container)]
    px-[24px]
    py-[16px]
    shadow-[1px_1px_1px_0px_#00000026]
  "
    >
      {/* Header */}
      <div className="flex h-[28px] w-full items-center gap-5">
        {/* Title */}

        {/* Title + Badge */}
        <div className="flex items-center gap-4">
          <h2
            className="
              h-[24px]
              w-[322px]
              text-xs
              font-semibold
              uppercase
              tracking-widest
              text-[16px]
              
              uppercase
              tracking-[2px]
              
              leading-[24px]
              text-[var(--text-text-primary)]
              whitespace-nowrap
            "
          >
            Warning And Error Summary
          </h2>

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
            11
          </span>
        </div>

        {/* Attribute Dropdown */}
        <div className="flex h-[28px] w-[270px] items-center gap-9">
          {/* Label */}
          <label
            className="
              w-[37px]
              text-[13px]
              leading-[20px]
              font-semibold
              whitespace-nowrap
              text-[var(--text-text-primary)]
              font-sans
            "
          >
            Attributes
          </label>

          {/* Dropdown */}
          <select
            className="
              h-[28px]
              w-[217px]
              rounded-[4px]
              border
              border-[var(--component-card-border)]
              bg-[var(--background-primary-container)]
              px-2
              text-[12px]
              leading-[20px]
              text-[var(--text-text-primary)]
              outline-none
            "
          >
            <option>All</option>
          </select>
        </div>

        {/* Type Dropdown */}
        <div className="flex h-[28px] w-[270px] items-center gap-3">
          {/* Type Label */}
          <label
            className="
                w-[37px]
                text-[12px]
                font-semibold
                leading-[20px]
                whitespace-nowrap
                text-[var(--text-text-primary)]
              "
          >
            Type
          </label>

          {/* Dropdown */}
          <select
            className="
                h-[28px]
                w-[217px]
                rounded-[4px]
                border
                border-[var(--component-card-border)]
                bg-[var(--background-primary-container)]
                px-2
                text-[12px]
                leading-[20px]
                text-[var(--text-text-primary)]
                outline-none
              "
          >
            <option>All</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <Table columns={columns} data={data} stickyHeader zebraStripes />
      </div>
    </div>
  );
}
