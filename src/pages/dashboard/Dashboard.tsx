import TableCard from "../../components/tables/TableCard";
import type {
  StatCardData,
  StatusSummaryRow,
  WarningRow,
} from "../../types/dashboardTypes";
import StatCard from "./components/StatCard";

import { createColumnHelper } from "@tanstack/react-table";
const statCards: StatCardData[] = [
  {
    title: "TOTAL UNITS",
    chartData: [
      {
        name: "Good",
        value: 10,
      },
      {
        name: "Warning",
        value: 4,
      },
      {
        name: "Error",
        value: 3,
      },
    ],
  },
  {
    title: "MPC ASSETS",
    chartData: [
      {
        name: "Good",
        value: 154,
      },
      {
        name: "Warning",
        value: 20,
      },
      {
        name: "Error",
        value: 9,
      },
    ],
  },
  {
    title: "TOTAL CONTROLLERS",
    chartData: [
      {
        name: "Good",
        value: 300,
      },
      {
        name: "Warning",
        value: 30,
      },
      {
        name: "Error",
        value: 12,
      },
    ],
  },
  {
    title: "REGULATORY ASSETS",
    chartData: [
      {
        name: "Good",
        value: 90,
      },
      {
        name: "Warning",
        value: 30,
      },
      {
        name: "Error",
        value: 9,
      },
    ],
  },
];

const statusData: StatusSummaryRow[] = [
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

/* =====================================================
                     WARNING DATA
===================================================== */

const warningData: WarningRow[] = [
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

/* =====================================================
                    STATUS COLUMNS
===================================================== */

const statusColumnHelper = createColumnHelper<StatusSummaryRow>();

const statusColumns = [
  statusColumnHelper.accessor("unitName", {
    header: "Unit Name",
  }),

  statusColumnHelper.accessor("totalControllers", {
    header: "Total Controllers",

    cell: ({ getValue }) => (
      <div className="text-center font-medium">{getValue()}</div>
    ),
  }),

  statusColumnHelper.accessor("good", {
    header: "Good",

    cell: ({ getValue }) => (
      <div className="flex justify-center">
        <span
          className="
            rounded-full
            border
            border-[var(--color-success)]
            px-3
            py-1
            text-xs
            font-semibold
            text-[var(--color-success)]
          "
        >
          {getValue()}
        </span>
      </div>
    ),
  }),

  statusColumnHelper.accessor("warning", {
    header: "Warnings",

    cell: ({ getValue }) => (
      <div className="flex justify-center">
        <span
          className="
            rounded-full
            border
            border-[var(--color-warning)]
            px-3
            py-1
            text-xs
            font-semibold
            text-[var(--color-warning)]
          "
        >
          {getValue()}
        </span>
      </div>
    ),
  }),

  statusColumnHelper.accessor("error", {
    header: "Errors",

    cell: ({ getValue }) => (
      <div className="flex justify-center">
        <span
          className="
            rounded-full
            border
            border-[var(--color-danger)]
            px-3
            py-1
            text-xs
            font-semibold
            text-[var(--color-danger)]
          "
        >
          {getValue()}
        </span>
      </div>
    ),
  }),
];

/* =====================================================
                   WARNING COLUMNS
===================================================== */

const warningColumnHelper = createColumnHelper<WarningRow>();

const warningColumns = [
  warningColumnHelper.accessor("unitName", {
    header: "Unit Name",
  }),

  warningColumnHelper.accessor("type", {
    header: "Type",
  }),

  warningColumnHelper.accessor("controllerName", {
    header: "Controller Name",

    cell: ({ getValue }) => (
      <span
        className="
          text-[var(--color-primary)]
        "
      >
        {getValue()}
      </span>
    ),
  }),

  warningColumnHelper.accessor("attributeName", {
    header: "Attribute Name",
  }),

  warningColumnHelper.accessor("errorMessage", {
    header: "Error Message",
  }),
];

export default function Dashboard() {
  return (
    <div
      className="
      h-full overflow-y-auto
    mx-auto
    w-full
    min-h-[938px]
    rounded-[2px]
    bg-[#272727]
    p-4
    md:p-6
    text-white
  "
    >
      <div className="flex items-center gap-3 w-full">
        <h1 className="text-lg font-semibold tracking-wide">Power Boiler</h1>

        <span className="rounded-full border border-sky-500 px-2 py-0.5 text-xs font-medium text-sky-400">
          AREA
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-4 xl:flex-row">
        <div className="grid flex-[656] grid-cols-1 gap-4 sm:grid-cols-2">
          {statCards.map((card) => (
            <StatCard key={card.title} data={card} />
          ))}
        </div>

        <div className="flex-[804]  min-w-0">
          <TableCard
            title="Unit Wise Status Summary"
            columns={statusColumns}
            data={statusData}
            height="h-[344px]"
            border="border-[var(--color-button-text-primary)]"
            headerActions={<></>}
          />
        </div>
      </div>

      <div className="mt-4 h-full">
        <TableCard
          title="Warning And Error Summary"
          badge={11}
          columns={warningColumns}
          data={warningData}
          headerActions={
            <>
              {/* Attribute Filter */}
              <div className="flex h-[28px] w-[270px] items-center gap-9">
                <label
                  className="
          w-[37px]
          text-[13px]
          leading-[20px]
          font-semibold
          whitespace-nowrap
          text-[var(--text-text-primary)]
        "
                >
                  Attributes
                </label>

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
                  <option>Data Source</option>
                  <option>Data Sink</option>
                  <option>Valve Stiction</option>
                </select>
              </div>

              {/* Type Filter */}

              <div className="flex h-[28px] w-[270px] items-center gap-3">
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
          text-[var(--text-text-primary)]
          outline-none
        "
                >
                  <option>All</option>
                  <option>Regulatory</option>
                  <option>MPC</option>
                </select>
              </div>
            </>
          }
        />
      </div>
    </div>
  );
}
