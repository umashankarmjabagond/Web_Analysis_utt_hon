import type { ToolbarButtonProps } from "../../../../types/workFlowTypes";
import { cn } from "../../../../utils/utils";
export default function ToolbarButton({
  icon: Icon,
  active = false,
  title,
  onClick,
  disabled,
  iconClassName,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`
        flex
        h-7
        w-7
        items-center
        justify-center
        rounded-[3px]
        transition-colors
        duration-150
        disabled && "cursor-not-allowed",

        ${
          active
            ? "bg-[#315D7A] text-white"
            : "text-[#8F8F8F] hover:bg-[#292929] hover:text-white"
        }
      `}
    >
      <Icon
        className={cn(
          "h-4 w-4",
          iconClassName,
          disabled && "text-toolbar-icon-disabled",
        )}
      />
    </button>
  );
}
