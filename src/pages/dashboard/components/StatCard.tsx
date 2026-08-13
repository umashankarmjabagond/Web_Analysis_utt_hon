
import DonutChart from "../../../components/charts/DonutChart";
import { STATUS_COLORS } from "../../../constants/constants";
import type { StatCardProps } from "../../../types/dashboardTypes";

const DONUT_SIZE = 88;

export default function StatCard({ data }: StatCardProps) {
  const total = data.chartData.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  return (
    <div className="w-full min-w-0 h-[164px] overflow-auto scrollbar-hide rounded-md border border-[var(--component-card-border)] bg-[var(--background-primary-container)] px-6 py-4">
      {/* Header */}
      <div className="flex h-7 w-full min-w-[220px] items-center justify-between gap-2">
        <h2 className="min-w-0 truncate text-[12px] font-extrabold uppercase leading-4 tracking-[2px] text-text-accent">
          {data.title}
        </h2>

        <span className="shrink-0 text-[20px] font-extrabold leading-7 text-white">
          {total}
        </span>
      </div>

      {/* Donut + Legend */}
<div className="mt-4 flex justify-center">
<DonutChart
  data={data.chartData}
  size={DONUT_SIZE}
  colors={STATUS_COLORS}
  innerRadius={DONUT_SIZE / 2 - 10}
  outerRadius={DONUT_SIZE / 2}
  legendPosition="right"
/>
</div>
    </div>
  );
}