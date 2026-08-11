import Badge from "../../components/common/badge/Badge";
import Select from "../../components/forms/select/Select";
import TableCard from "../../components/tables/TableCard";
import type {
  StatCardData,
  StatusSummaryRow,
  WarningRow,
} from "../../types/dashboardTypes";
import StatCard from "./components/StatCard";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

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
      <Badge
        variant="success"
        fill="outline"
        className="bg-transparent px-3 py-1"
      >
        {getValue()}
      </Badge>
      // <div className="flex justify-center">
      //   <span
      //     className={cn(
      //       "rounded-full border",
      //       "border-success text-success",
      //       "px-3 py-1",
      //       "text-xs font-semibold",
      //     )}
      //   >
      //     {getValue()}
      //   </span>
      // </div>
    ),
  }),

  statusColumnHelper.accessor("warning", {
    header: "Warnings",

    cell: ({ getValue }) => (
      <Badge
        variant="warning"
        fill="outline"
        className="bg-transparent px-3 py-1"
      >
        {getValue()}
      </Badge>
      // <div className="flex justify-center">
      //   <span
      //     className={cn(
      //       "rounded-full border",
      //       "border-warning text-warning",
      //       "px-3 py-1",
      //       "text-xs font-semibold",
      //     )}
      //   >
      //     {getValue()}
      //   </span>
      // </div>
    ),
  }),

  statusColumnHelper.accessor("error", {
    header: "Errors",

    cell: ({ getValue }) => (
      <Badge
        variant="danger"
        fill="outline"
        className="bg-transparent px-3 py-1"
      >
        {getValue()}
      </Badge>
      // <div className="flex justify-center">
      //   <span
      //     className={cn(
      //       "rounded-full border",
      //       "border-danger text-danger",
      //       "px-3 py-1",
      //       "text-xs font-semibold",
      //     )}
      //   >
      //     {getValue()}
      //   </span>
      // </div>
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
      <span className="text-foreground-accent">{getValue()}</span>
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
  const { t } = useTranslation();
  return (
    <div className="h-full overflow-y-auto mx-auto w-full min-h-[938px] rounded-xs bg-surface p-4 md:p-6">
      <div className="flex items-center gap-3 w-full">
        <h1 className="text-lg font-semibold tracking-wide text-foreground-secondary">
          {t("DASHBOARD_POWER_BOILER")}
        </h1>

        <Badge
          variant="info"
          fill="outline"
          className="px-2 py-1 text-xs font-medium h-6 rounded-2xl"
        >
          {t("DASHBOARD_AREA")}
        </Badge>
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
            border="border-surface"
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
              <div className="flex h-7 w-[270px] items-center gap-4">
                <label className="w-[77px] shrink-0 whitespace-nowrap text-[13px] font-semibold leading-5 text-foreground">
                  Attributes
                </label>

                <Select
                  value="All"
                  onChange={() => {}}
                  options={[
                    { value: "All", label: "All" },
                    { value: "Data Source", label: "Data Source" },
                    { value: "Data Sink", label: "Data Sink" },
                    { value: "Valve Stiction", label: "Valve Stiction" },
                  ]}
                  className="h-7 w-[177px] text-xs"
                />
              </div>

              {/* Type Filter */}
              <div className="flex h-7 w-[270px] items-center gap-4">
                <label className="w-[37px] shrink-0 whitespace-nowrap text-xs font-semibold leading-5 text-foreground">
                  Type
                </label>

                <Select
                  value="All"
                  onChange={() => {}}
                  options={[
                    { value: "All", label: "All" },
                    { value: "Regulatory", label: "Regulatory" },
                    { value: "MPC", label: "MPC" },
                  ]}
                  className="h-7 w-[217px] text-xs"
                />
              </div>
            </>
          }
        />
      </div>
    </div>
  );
}
