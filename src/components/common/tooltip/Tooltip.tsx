import { useState } from "react";
import type { TooltipProps } from "../../../types/commonTypes";

export default function Tooltip({
  children,
  content,
  placement = "bottom",
  disabled,
  maxWidth,
  showArrow = true,
  className = "",
}: TooltipProps) {
  const [open, setOpen] = useState(false);

  const handleOnFocus = () => {
    setOpen(true);
  };

  const handleOnBlur = () => {
    setOpen(false);
  };

  const handleOnMouseEnter = () => {
    setOpen(true);
  };

  const handleOnMouseLeave = () => {
    setOpen(false);
  };

  const PLACEMENT_STYLES = {
    top: {
      tooltip: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      arrow: "bottom-[-4px] left-1/2 -translate-x-1/2",
    },
    bottom: {
      tooltip: "top-full left-1/2 -translate-x-1/2 mt-2",
      arrow: "top-[-4px] left-1/2 -translate-x-1/2",
    },
    left: {
      tooltip: "right-full top-1/2 -translate-y-1/2 mr-2",
      arrow: "right-[-4px] top-1/2 -translate-y-1/2",
    },
    right: {
      tooltip: "left-full top-1/2 -translate-y-1/2 ml-2",
      arrow: "left-[-4px] top-1/2 -translate-y-1/2",
    },
  } satisfies Record<
    NonNullable<TooltipProps["placement"]>,
    {
      tooltip: string;
      arrow: string;
    }
  >;

  if (!content || disabled) return children;

  return (
    <div
      className="relative inline-flex"
      onFocus={handleOnFocus}
      onBlur={handleOnBlur}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      {children}
      {open && (
        <div
          role="tooltip"
          style={{ maxWidth: maxWidth ?? 300 }}
          className={`absolute w-max z-50 rounded bg-app-surface-elevated px-2 py-2 text-app-text-primary font-medium text-[14px] ${PLACEMENT_STYLES[placement]["tooltip"]} ${className}`}
        >
          {content}
          {showArrow && (
            <div
              className={`absolute h-2 w-2 bg-app-surface-elevated rotate-45 ${PLACEMENT_STYLES[placement]["arrow"]}`}
            />
          )}
        </div>
      )}
    </div>
  );
}
