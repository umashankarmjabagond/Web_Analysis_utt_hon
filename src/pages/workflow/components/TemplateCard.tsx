import { Boxes } from "lucide-react";
import type { TemplateCardProps } from "../../../types/commonTypes";

export default function TemplateCard({ title }: TemplateCardProps) {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("application/reactflow", title);

    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="flex h-28 cursor-grab flex-col items-center justify-center rounded-md border border-neutral-500 bg-[#4A4A4A] text-center transition hover:border-blue-500 active:cursor-grabbing"
    >
      <Boxes size={18} className="mb-3 text-gray-300" />

      <span className="text-sm text-gray-200">{title}</span>
    </div>
  );
}
