import { PieChart, Pie } from "recharts";
import type { DonutChartProps } from "../../types/commonTypes";

export default function DonutChart({
  data,
  size = 88,
  colors,
  className = "",
}: DonutChartProps) {
  
  const chartData = data.map((item) => ({
    ...item,
    fill: colors[item.name as keyof typeof colors],
  }));

  return (
    <div
      className={`shrink-0 grow-0 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <PieChart width={size} height={size} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={size * 0.32}
          outerRadius={size * 0.48}
          paddingAngle={0}
          stroke="none"
          isAnimationActive={false}
        />
      </PieChart>
    </div>
  );
}