import type { CustomLegendProps } from "../../types/commonTypes";

function CustomLegend({ data, width }: CustomLegendProps) {
  return (
    <div
      className="grid gap-y-3 gap-x-2 items-center"
      style={{ width, gridTemplateColumns: "4px 1fr auto" }}
    >
      {data.map((item) => (
        <div key={item.name} className="contents">
          <span
            className="h-5 w-1 rounded-sm"
            style={{ backgroundColor: item.fill }}
          />
          <span className="text-foreground-secondary text-sm whitespace-nowrap truncate">
            {item.name}
          </span>
          <span className="font-semibold text-foreground-secondary text-sm text-right whitespace-nowrap">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default CustomLegend;