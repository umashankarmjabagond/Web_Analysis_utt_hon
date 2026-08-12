import DonutChart from "../../../components/charts/DonutChart";
import { STATUS_COLORS } from "../../../constants/constants";
import type { StatCardProps } from "../../../types/dashboardTypes";
import { useTranslation } from "react-i18next";
export default function StatCard({ data }: StatCardProps) {
  const { t } = useTranslation();
  const total = data.chartData.reduce((sum, item) => sum + item.value, 0);

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

      {/* Body */}
      <div className="mt-4 flex min-h-0 items-center gap-4">
        {/* Chart */}
        <div className="flex shrink-0 items-center justify-center h-[72px] w-[72px] sm:h-20 sm:w-20 xl:h-[88px] xl:w-[88px]">
          <DonutChart data={data.chartData} size={88} colors={STATUS_COLORS} />
        </div>

        {/* Legend */}
        <div className="min-w-0 flex-1 space-y-2">
          {data.chartData.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 ">
                <span
                  className="h-5 w-[3px] rounded shrink-0"
                  style={{
                    backgroundColor:
                      STATUS_COLORS[item.name as keyof typeof STATUS_COLORS],
                  }}
                />

                <span className="truncate text-sm leading-5 text-stat-card-foreground-secondary">
                  {t(`COMMON_${item.name.toUpperCase()}`)}
                </span>
              </div>

              <span className="shrink-0 text-sm leading-5 text-stat-card-foreground-secondary">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
