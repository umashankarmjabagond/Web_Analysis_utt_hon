import { PieChart, Pie, Sector } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import type { DonutChartProps ,LegendItem} from "../../types/commonTypes";
import CustomLegend from "./CustomLegend";


const STATUS_ORDER = ["Good", "Warning", "Error"];
const GAP = 44;
const LEGEND_WIDTH = 140;

export default function DonutChart({
  data,
  size = 88,
  colors,
  className = "",
}: DonutChartProps) {
  const orderedData = STATUS_ORDER.map((status) =>
    data.find((item) => item.name === status),
  ).filter(Boolean) as typeof data;

  const chartData: LegendItem[] = orderedData.map((item) => ({
    ...item,
    fill: colors[item.name as keyof typeof colors],
  }));

  return (
    <div
      className={`flex items-center ${className}`}
      style={{ width: size + GAP + LEGEND_WIDTH, gap: GAP }}
    >
      <div style={{ width: size, height: size, flexShrink: 0 }}>
        <PieChart width={size} height={size}>
          <Pie
            data={chartData}
            dataKey="value"
            innerRadius={size / 2 - 10}
            outerRadius={size / 2}
            paddingAngle={2}
            stroke="none"
            shape={(props: PieSectorDataItem) => {
              const item = props.payload as unknown as LegendItem;
              return <Sector {...props} fill={item.fill} />;
            }}
          />
        </PieChart>
      </div>

      <CustomLegend data={chartData} width={LEGEND_WIDTH} />
    </div>
  );
}