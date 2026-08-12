import type { ToolbarButtonProps } from "../../../../types/templateExecution";

export default function ToolbarExecutionButton({
  icon: Icon,
  label,
  active = false,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex h-8 w-[102px] items-center gap-2 rounded-[4px] px-2 py-1.5 text-[14px] cursor-pointer hover:text-app-text-primary hover:bg-surface-hover ${
        active ? "text-foreground-accent" : "text-foreground-muted"
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}
