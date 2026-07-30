import DonutChart from "../../../components/charts/DonutChart";
import { STATUS_COLORS } from "../../../constants/constants";
import type { StatCardProps } from "../../../types/dashboardTypes";

export default function StatCard({ data }: StatCardProps) {
  const total = data.chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div
      className="
        flex
        h-full
        flex-col
        rounded-md
        border
        border-[#303030]
        bg-[#404040]
        p-4
        overflow-hidden
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 shrink-0">
        <h2
          className="
            text-[12px]
            font-extrabold
            uppercase
            tracking-[2px]
            text-[#D0D0D0]
            leading-4
          "
        >
          {data.title}
        </h2>

        <span
          className="
            text-[20px]
            font-extrabold
            leading-7
            text-white
            whitespace-nowrap
          "
        >
          {total}
        </span>
      </div>

      {/* Body */}
      <div
        className="
          mt-4
          flex
          
          min-h-0
          items-center
          gap-4
        "
      >
        {/* Chart */}
        <div
          className="
            flex
            flex-shrink-0
            items-center
            justify-center
            w-[72px]
            h-[72px]
            sm:w-[80px]
            sm:h-[80px]
            xl:w-[88px]
            xl:h-[88px]
          "
        >
          <DonutChart data={data.chartData} size={88} colors={STATUS_COLORS} />
        </div>

        {/* Legend */}
        <div
          className="
            flex-1
    min-w-0
    space-y-2
          "
        >
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

                <span
                  className="
                    truncate
                    text-[14px]
                    leading-5
                    text-gray-200
                  "
                >
                  {item.name}
                </span>
              </div>

              <span
                className="
                  shrink-0
                  text-[14px]
                  leading-5
                  text-gray-200
                "
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
