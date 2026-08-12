import type { ToolbarButtonProps } from "../../../../types/workFlowTypes";
import { cn } from "../../../../utils/utils";

export default function ToolbarButton({
  icon: Icon,
  active = false,
  title,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={cn(
        "flex h-7 w-7 items-center justify-center",
        "rounded",
        "cursor-pointer",
        "transition-all duration-150",
        active
          ? "bg-toolbar-item-active-background text-toolbar-item-active-foreground"
          : "text-foreground hover:bg-surface-hover",
      )}
    >
      <Icon size={15} />
    </button>
  );
}
