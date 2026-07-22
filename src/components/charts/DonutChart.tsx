import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
import type { DonutChartProps } from "../../types/commonTypes";

export default function DonutChart({
  data,
  size = 80,
  colors,
}: DonutChartProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={size * 0.32}
            outerRadius={size * 0.48}
            paddingAngle={0}
            stroke="none"
            isAnimationActive={false}
            shape={(props) => (
              <Sector
                {...props}
                fill={colors[props.payload.name as keyof typeof colors]}
                stroke="none"
              />
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
