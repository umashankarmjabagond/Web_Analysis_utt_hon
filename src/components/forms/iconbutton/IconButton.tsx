import { cloneElement, isValidElement, type ReactElement } from "react";
import type { IconButtonProps } from "../../../types/commonTypes";
import type { LucideProps } from "lucide-react";
import { cn } from "../../../utils/utils";

const sizeClasses = {
  sm: "h-7 w-7",
  md: "h-[46px] w-[46px]",
  lg: "h-12 w-12",
};

const iconSizes = {
  sm: 14,
  md: 18,
  lg: 20,
};

const IconButton = ({
  icon,
  size = "md",
  className,
  ...props
}: IconButtonProps) => {
  const renderedIcon = isValidElement(icon)
    ? cloneElement(icon as ReactElement<LucideProps>, {
        size: iconSizes[size],
        className: "text-[var(--color-button-focus)]",
        strokeWidth: 2.25,
      })
    : icon;

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center",
        "rounded-sm border",
        "bg-button-secondary-background",
        "border-button-secondary-border",
        "transition-colors duration-200",
        "hover:bg-button-secondary-hover-background",
        "hover:border-button-secondary-hover-border",
        "focus-visible:outline-2",
        "focus-visible:outline-offset-2",
        "focus-visible:outline-button-focus-ring",
        "disabled:cursor-not-allowed",
        "disabled:bg-button-disabled-background",
        "disabled:border-button-disabled-border",
        "disabled:text-button-disabled-foreground",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {renderedIcon}
    </button>
  );
};

export default IconButton;
