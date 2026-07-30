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
      className={`flex h-20 select-none flex-col items-center justify-center rounded border border-[#707070] bg-[#4A4A4A] px-2 text-center transition-all duration-200 hover:border-[#9CA3AF] hover:bg-[#535353] ${
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
