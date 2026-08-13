import { PieChart, Pie, ResponsiveContainer } from "recharts";
import type { DonutChartProps } from "../../types/commonTypes";

const STATUS_ORDER = ["Good", "Warning", "Error"];

export default function DonutChart({
  data,
  size = 88,
  colors,
  className = "",
  innerRadius,
  outerRadius,
  legendPosition = "right",
}: DonutChartProps) {
  const orderedData = STATUS_ORDER.map((status) =>
    data.find((item) => item.name === status),
  ).filter(Boolean) as typeof data;

  const chartData = orderedData.map((item) => ({
    ...item,
    fill: colors[item.name as keyof typeof colors],
  }));

  const legend = (
    <div className="flex flex-col justify-between h-[88px] min-w-[120px]">
      {orderedData.map((item) => (
        <div
          key={item.name}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div
              className="h-5 w-[3px] rounded-full"
              style={{
                backgroundColor:
                  colors[item.name as keyof typeof colors],
              }}
            />
            <span className="text-[14px] text-text-accent">
              {item.name}
            </span>
          </div>

          <span className="text-[14px] text-text-accent">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );

  const chart = (
    <div style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            stroke="none"
            isAnimationActive={false}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const layoutClasses = {
    right: "flex flex-row items-center gap-6",
    left: "flex flex-row-reverse items-center gap-6",
    top: "flex flex-col-reverse items-center gap-4",
    bottom: "flex flex-col items-center gap-4",
  };

  return (
    <div className={`${layoutClasses[legendPosition]} ${className}`}>
      {chart}
      {legend}
    </div>
  );
}