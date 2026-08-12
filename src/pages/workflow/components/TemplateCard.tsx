import type { TemplateCardProps } from "../../../types/commonTypes";
import { cn } from "../../../utils/utils";

export default function TemplateCard({
  title,
  draggable = false,
  icon: Icon,
  onClick,
  onDragStart,
}: TemplateCardProps) {
  return (
    <div
      draggable={draggable}
      onClick={onClick}
      onDragStart={onDragStart}
      className={cn(
        "flex h-20 select-none flex-col items-center justify-center rounded border px-2 text-center transition-all duration-200",
        "border-card-border bg-card-background text-card-foreground",
        "hover:border-card-hover-border hover:bg-card-hover-background",
        draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
      )}
    >
      {Icon && (
        <Icon
          className="mb-2 text-card-foreground"
          size={18}
          strokeWidth={1.8}
        />
      )}

      <span className="break-words text-[12px] leading-4 text-card-foreground-secondary">
        {title}
      </span>
    </div>
  );
}
