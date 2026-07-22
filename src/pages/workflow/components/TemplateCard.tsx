interface TemplateCardProps {
  title: string;
  draggable?: boolean;
  onClick?: () => void;
}

export default function TemplateCard({
  title,
  draggable = true,
  onClick,
}: TemplateCardProps) {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    if (!draggable) return;

    event.dataTransfer.setData("application/reactflow", title);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable={draggable}
      onDragStart={draggable ? onDragStart : undefined}
      onClick={!draggable ? onClick : undefined}
      className={`flex h-28 flex-col items-center justify-center rounded-md border border-neutral-500 bg-[#4A4A4A] text-center transition hover:border-blue-500 ${
        draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
      }`}
    >
      ...
    </div>
  );
}
