import DonutChart from "../../../components/charts/DonutChart";
import { STATUS_COLORS } from "../../../constants/constants";
import type { StatCardProps } from "../../../types/dashboardTypes";

export default function StatCard({ data }: StatCardProps) {
  const total = data.chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full min-w-0 h-[164px] overflow-hidden rounded-md border border-[var(--component-card-border)] bg-[var(--background-primary-container)] py-4 px-6">
      
      <div className="flex items-center justify-between gap-2 min-w-0">
        <h2 className="text-[12px] leading-4 font-extrabold uppercase tracking-[2px] text-text-accent truncate min-w-0">
          {data.title}
        </h2>
        <span className="shrink-0 text-[20px] leading-7 font-extrabold text-white">
          {total}
        </span>
      </div>

      
      <div className="mt-4 grid grid-cols-[minmax(64px,88px)_1fr_minmax(0,auto)] items-center gap-2 sm:gap-4 w-full h-[88px] min-w-0">
        
        <div className="shrink-0 aspect-square w-full max-w-[88px] flex items-center justify-center">
          <DonutChart data={data.chartData} size={88} colors={STATUS_COLORS} />
        </div>

        
        <div className="flex flex-col justify-between h-[88px] mx-auto min-w-0">
          {data.chartData.map((item) => (
            <div key={item.name} className="h-6 flex items-center gap-2 min-w-0">
              <svg
                width="3"
                height="20"
                viewBox="0 0 3 20"
                className="shrink-0"
                aria-hidden="true"
              >
                <rect
                  width="3"
                  height="20"
                  rx="1.5"
                  fill={STATUS_COLORS[item.name as keyof typeof STATUS_COLORS]}
                />
              </svg>
              <span className="text-[14px] leading-5 text-text-accent truncate">
                {item.name}
              </span>
            </div>
          ))}
        </div>

        
        <div className="flex flex-col justify-between h-[88px] items-end min-w-0">
          {data.chartData.map((item) => (
            <span
              key={item.name}
              className="h-6 flex items-center text-[14px] leading-5 text-text-accent truncate"
            >
              {item.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}