import { cloneElement, isValidElement, type ReactElement } from "react";
import type { IconButtonProps } from "../../../types/commonTypes";
import clsx from "clsx";
import type { LucideProps } from "lucide-react";

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
      className={clsx(
        "inline-flex items-center justify-center",
        "rounded-[var(--radius-sm)]",
        "border border-border-1",
        "bg-panel-bg",
        "transition-colors duration-200",
        "hover:bg-panel-hover",
        "hover:border-[var(--color-button-focus)]",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-[var(--color-button-focus)]",
        "disabled:cursor-not-allowed",
        "disabled:opacity-50",
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
