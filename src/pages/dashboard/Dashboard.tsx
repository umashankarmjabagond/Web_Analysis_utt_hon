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
    title: "DASHBOARD_TOTAL_UNITS",
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
    title: "DASHBOARD_MPC_ASSETS",
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
    title: "DASHBOARD_TOTAL_CONTROLLERS",
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
    title: "DASHBOARD_REGULATORY_ASSETS",
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

const statusColumnHelper = createColumnHelper<StatusSummaryRow>();

const warningColumnHelper = createColumnHelper<WarningRow>();

export default function Dashboard() {
  const { t } = useTranslation();

  const statusColumns = [
    statusColumnHelper.accessor("unitName", {
      header: t("TABLE_UNIT_NAME"),
    }),

    statusColumnHelper.accessor("totalControllers", {
      header: t("TABLE_TOTAL_CONTROLLERS"),
    }),

    statusColumnHelper.accessor("good", {
      header: t("TABLE_GOOD"),
      cell: ({ getValue }) => (
        <Badge
          variant="success"
          fill="outline"
          className="bg-transparent px-3 py-1"
        >
          {getValue()}
        </Badge>
      ),
    }),

    statusColumnHelper.accessor("warning", {
      header: t("TABLE_WARNINGS"),
      cell: ({ getValue }) => (
        <Badge
          variant="warning"
          fill="outline"
          className="bg-transparent px-3 py-1"
        >
          {getValue()}
        </Badge>
      ),
    }),

    statusColumnHelper.accessor("error", {
      header: t("TABLE_ERRORS"),
      cell: ({ getValue }) => (
        <Badge
          variant="danger"
          fill="outline"
          className="bg-transparent px-3 py-1"
        >
          {getValue()}
        </Badge>
      ),
    }),
  ];

  const warningColumns = [
    warningColumnHelper.accessor("unitName", {
      header: t("TABLE_UNIT_NAME"),
    }),

    warningColumnHelper.accessor("type", {
      header: t("FILTER_TYPE"),
    }),

    warningColumnHelper.accessor("controllerName", {
      header: t("TABLE_CONTROLLER_NAME"),
      cell: ({ getValue }) => (
        <span className="text-[var(--color-primary)]">{getValue()}</span>
      ),
    }),

    warningColumnHelper.accessor("attributeName", {
      header: t("TABLE_ATTRIBUTE_NAME"),
    }),

    warningColumnHelper.accessor("errorMessage", {
      header: t("TABLE_ERROR_MESSAGE"),
    }),
  ];
  return (
    <div className="h-full overflow-y-auto mx-auto w-full min-h-[938px] rounded-xs bg-[#272727] p-4 md:p-6">
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
            title={t("DASHBOARD_UNIT_WISE_STATUS_SUMMARY")}
            columns={statusColumns}
            data={statusData}
            height="h-[344px]"
            headerActions={<></>}
          />
        </div>
      </div>

      <div className="mt-4 h-full">
        <TableCard
          title={t("DASHBOARD_WARNING_ERROR_SUMMARY")}
          badge={11}
          columns={warningColumns}
          data={warningData}
          headerActions={
            <>
              {/* Attribute Filter */}
              <div className="flex h-7 w-[270px] items-center gap-4">
                <label className="w-[77px] shrink-0 whitespace-nowrap text-[13px] font-semibold leading-5 text-foreground">
                  {t("FILTER_ATTRIBUTES")}
                </label>

                <Select
                  value="All"
                  onChange={() => {}}
                  options={[
                    { value: "All", label: t("FILTER_ALL") },
                    { value: "Data Source", label: t("FILTER_DATA_SOURCE") },
                    { value: "Data Sink", label: t("FILTER_DATA_SINK") },
                    {
                      value: "Valve Stiction",
                      label: t("FILTER_VALVE_STICTION"),
                    },
                  ]}
                  className="h-7 w-[177px] text-xs"
                />
              </div>

              {/* Type Filter */}
              <div className="flex h-7 w-[270px] items-center gap-4">
                <label className="w-[37px] shrink-0 whitespace-nowrap text-xs font-semibold leading-5 text-foreground">
                  {t("FILTER_TYPE")}
                </label>

                <Select
                  value="All"
                  onChange={() => {}}
                  options={[
                    { value: "All", label: t("FILTER_ALL") },
                    { value: "Regulatory", label: t("FILTER_REGULATORY") },
                    { value: "MPC", label: t("FILTER_MPC") },
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
