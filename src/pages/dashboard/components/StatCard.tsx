import DonutChart from "../../../components/charts/DonutChart";
import { STATUS_COLORS } from "../../../constants/constants";
import type { StatCardProps } from "../../../types/dashboardTypes";

export default function StatCard({ data }: StatCardProps) {
  const total = data.chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full min-w-0 h-[164px] rounded-md border border-[var(--component-card-border)] bg-[var(--background-primary-container)] py-4 px-6 overflow-hidden">
      <div className="flex items-center justify-between gap-2 min-w-0">
        <h2 className="text-[12px] leading-4 font-extrabold uppercase tracking-[2px] text-text-accent truncate min-w-0">
          {data.title}
        </h2>

        <span className="shrink-0 text-[20px] leading-7 font-extrabold text-white">
          {total}
        </span>
      </div>

<div className="mt-4 h-[88px] w-full overflow-x-auto overflow-y-hidden no-scrollbar">
  <DonutChart
    data={data.chartData}
    size={88}
    colors={STATUS_COLORS}
  />
</div>
    </div>
  );
}