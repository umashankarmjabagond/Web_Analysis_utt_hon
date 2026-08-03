import { Boxes } from "lucide-react";
import type { TemplateCardProps } from "../../../types/commonTypes";

export default function TemplateCard({
  title,
  draggable = false,
  onClick,
  onDragStart,
}: TemplateCardProps) {
  return (
    <div
      draggable={draggable}
      onClick={onClick}
      onDragStart={onDragStart}
      className={`flex h-20 select-none flex-col items-center justify-center rounded border border-app-divider bg-app-surface-secondary px-2 text-center transition-all duration-200 hover:border-app-border-muted hover:bg-app-default-node ${
        draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
      }`}
    >
      <Boxes size={14} strokeWidth={1.8} className="mb-2 text-gray-200" />

      <span className="break-words text-[12px] leading-4 text-gray-100">
        {title}
      </span>
    </div>
  );
}
