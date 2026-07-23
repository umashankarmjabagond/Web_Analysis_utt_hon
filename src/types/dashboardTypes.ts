export interface DonutChartItem {
  name: string;
  value: number;
}

export interface StatCardData {
  title: string;
  chartData: DonutChartItem[];
}

export interface StatCardProps {
  data: StatCardData;
}
