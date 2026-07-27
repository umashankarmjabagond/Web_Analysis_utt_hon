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

export interface StatusSummaryRow {
  unitName: string;
  totalControllers: number;
  good: number;
  warning: number;
  error: number;
}

export interface WarningRow {
  unitName: string;
  type: string;
  controllerName: string;
  attributeName: string;
  errorMessage: string;
}