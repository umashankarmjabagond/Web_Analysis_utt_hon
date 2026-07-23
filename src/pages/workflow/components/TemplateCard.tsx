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
      className={`flex h-28 flex-col items-center justify-center rounded-md border border-neutral-500 bg-[#4A4A4A] text-center transition hover:border-blue-500 ${
        draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
      }`}
    >
      <Boxes size={18} className="mb-3 text-gray-300" />

      <span className="text-sm text-gray-200">{title}</span>
    </div>
  );
}
