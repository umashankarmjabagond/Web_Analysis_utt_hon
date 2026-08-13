import DonutChart from "../../../components/charts/DonutChart";
import { STATUS_COLORS } from "../../../constants/constants";
import type { StatCardProps } from "../../../types/dashboardTypes";
import { useTranslation } from "react-i18next";

export default function StatCard({ data }: StatCardProps) {
  const DONUT_SIZE = 88;

  const total = data.chartData.reduce((sum, item) => sum + item.value, 0);
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[6px] border-[0.5px] border-stat-card-border bg-stat-card-background p-4 shadow-[1px_1px_1px_0_#00000026]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 shrink-0">
        <h2 className="text-xs font-extrabold uppercase leading-4  tracking-[2px] text-stat-card-foreground-secondary">
          {t(data.title)}
        </h2>

        <span className="whitespace-nowrap text-xl font-extrabold leading-7 text-stat-card-foreground">
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
