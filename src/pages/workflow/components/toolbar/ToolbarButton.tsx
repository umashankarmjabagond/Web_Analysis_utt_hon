import type { ToolbarButtonProps } from "../../../../types/workFlowTypes";

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
      className={`
        h-7
        w-7
        rounded
        flex
        items-center
        justify-center
        transition-all
        duration-150
        ${
          active
            ? "bg-component-action-primary text-white"
            : "text-text-muted hover:bg-app-surface-elevated"
        }
      `}
    >
      <Icon size={15} />
    </button>
  );
}
