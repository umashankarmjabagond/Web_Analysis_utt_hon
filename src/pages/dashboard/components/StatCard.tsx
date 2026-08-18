import { useEffect, useRef } from "react";
import DonutChart from "../../../components/charts/DonutChart";
import { STATUS_COLORS } from "../../../constants/constants";
import type { StatCardProps } from "../../../types/dashboardTypes";

const DONUT_SIZE = 88;

function formatTitle(rawTitle: string) {
  return rawTitle
    .replace(/^DASHBOARD_/i, "")
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function StatCard({ data }: StatCardProps) {
  const total = data.chartData.reduce((sum, item) => sum + item.value, 0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const resetIfFits = () => {
      if (el.scrollWidth <= el.clientWidth) el.scrollLeft = 0;
    };

    const observer = new ResizeObserver(resetIfFits);
    observer.observe(el);
    resetIfFits();

    return () => observer.disconnect();
  }, []);

  return (
   <div className="w-full min-w-0 h-[164px] rounded-md border border-stat-card-border bg-stat-card-background px-6 py-4 overflow-hidden">
  <div className="flex h-7 w-full min-w-0 items-center justify-between gap-2 overflow-hidden">
    <h2
      className="min-w-0 truncate text-[12px] font-extrabold uppercase leading-4 tracking-[2px] text-stat-card-foreground-secondary"
      title={formatTitle(data.title)}
    >
      {formatTitle(data.title)}
    </h2>
    <span className="shrink-0 text-[20px] font-extrabold leading-7 text-stat-card-foreground">
      {total}
    </span>
  </div>

  <div
    ref={scrollRef}
    className="mt-4 w-full flex overflow-x-auto overflow-y-hidden custom-scrollbar"
  >
    <DonutChart data={data.chartData} size={DONUT_SIZE} colors={STATUS_COLORS} />
  </div>
</div>
  );
}