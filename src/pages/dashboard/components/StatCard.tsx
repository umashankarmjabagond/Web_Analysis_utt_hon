import DonutChart from "../../../components/charts/DonutChart";
import { STATUS_COLORS } from "../../../constants/constants";
import type { StatCardProps } from "../../../types/dashboardTypes";

export default function StatCard({ data }: StatCardProps) {
  const total = data.chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full min-w-0 h-[164px] rounded-md border border-[#303030] bg-[#404040] py-4 px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          className="text-[12px]
            leading-4
            font-extrabold
            uppercase
            tracking-[2px]
            text-[#D0D0D0]"
        >
          {data.title}
        </h2>

        <span className="text-[20px] leading-7 font-extrabold text-white">
          {total}
        </span>
      </div>

      {/* Body */}
      <div className="mt-4 flex items-center justify-between w-full min-w-0 gap-4">
        {/* Chart */}
        <DonutChart data={data.chartData} size={88} colors={STATUS_COLORS} />

        {/* Legend */}
        <div className="w-[120px] shrink-0 space-y-3">
          {data.chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-5 w-[3px] rounded"
                  style={{
                    backgroundColor:
                      STATUS_COLORS[item.name as keyof typeof STATUS_COLORS],
                  }}
                />

                <span
                  className="text-[14px]
                    leading-5 text-gray-200"
                >
                  {item.name}
                </span>
              </div>

              <span
                className="text-[14px]
                    leading-5 text-gray-200"
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
