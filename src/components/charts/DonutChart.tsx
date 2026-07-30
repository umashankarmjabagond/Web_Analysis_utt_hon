import { PieChart, Pie, Legend, ResponsiveContainer } from "recharts";
import type { DonutChartProps } from "../../types/commonTypes";

const GAP_TO_DONUT = 16;
const LABEL_COL_WIDTH = 72;
const VALUE_COL_WIDTH = 40;
const STATUS_ORDER = ["Good", "Warning", "Error"];

export default function DonutChart({
  data,
  size = 88,
  colors,
  className = "",
}: DonutChartProps) {
  const orderedData = STATUS_ORDER.map((status) =>
    data.find((item) => item.name === status)
  ).filter(Boolean) as typeof data;

  const chartData = orderedData.map((item) => ({
    ...item,
    fill: colors[item.name as keyof typeof colors],
  }));

  // Minimum total width this component ever needs — never let it be squeezed below this
  const minTotalWidth = size + GAP_TO_DONUT + LABEL_COL_WIDTH + VALUE_COL_WIDTH;

  const renderLegend = () => (
    <div className="flex flex-col justify-between h-[88px] min-w-0" style={{ gap: 8 }}>
      {orderedData.map((item) => (
        <div
          key={item.name}
          className="grid items-center h-6 w-full min-w-0"
          style={{ gridTemplateColumns: `1fr ${VALUE_COL_WIDTH}px` }}
        >
          <div
            className="flex items-center gap-2 mx-auto min-w-0"
            style={{ width: LABEL_COL_WIDTH }}
          >
            <svg width="3" height="20" viewBox="0 0 3 20" className="shrink-0" aria-hidden="true">
              <rect
                width="3"
                height="20"
                rx="1.5"
                fill={colors[item.name as keyof typeof colors]}
              />
            </svg>
            <span className="text-[14px] leading-5 text-text-accent whitespace-nowrap">
              {item.name}
            </span>
          </div>
          <span className="text-[14px] leading-5 text-text-accent text-right">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ height: size, width: "100%", minWidth: minTotalWidth }}
    >
      <ResponsiveContainer width="100%" height={size}>
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx={size / 2}
            cy="50%"
            innerRadius={size * 0.32}
            outerRadius={size * 0.48}
            paddingAngle={0}
            stroke="none"
            isAnimationActive={false}
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            wrapperStyle={{
              position: "absolute",
              left: size + GAP_TO_DONUT,
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
            }}
            content={renderLegend}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}