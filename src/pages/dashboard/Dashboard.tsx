import type { StatCardData } from "../../types/dashboardTypes";
import StatCard from "./components/StatCard";
import StatusSummaryTable from "../../components/tables/StatusSummaryTable";
import WarningTable from "../../components/tables/WarningTable";
const statCards: StatCardData[] = [
  {
    title: "TOTAL UNITS",
    chartData: [
      {
        name: "Good",
        value: 100,
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
        value: 54,
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

export default function Dashboard() {
  return (
    <div
      className="
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

        <div className="flex-[804]">
          <StatusSummaryTable />
        </div>
      </div>

      <div className="mt-4">
        <WarningTable />
      </div>
    </div>
  );
}
