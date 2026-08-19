import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { TooltipProps } from "../../../types/commonTypes";
import { cn } from "../../../utils/utils";

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
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const triggerRef = useRef<HTMLSpanElement>(null);

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
      arrow: "bottom-[-4px] left-1/2 -translate-x-1/2",
    },
    bottom: {
      arrow: "top-[-4px] left-1/2 -translate-x-1/2",
    },
    left: {
      arrow: "right-[-4px] top-1/2 -translate-y-1/2",
    },
    right: {
      arrow: "left-[-4px] top-1/2 -translate-y-1/2",
    },
  } satisfies Record<
    NonNullable<TooltipProps["placement"]>,
    {
      arrow: string;
    }
  >;

  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      if (!triggerRef.current) return;

      const rect = triggerRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (placement) {
        case "top":
          top = rect.top - 8;
          left = rect.left + rect.width / 2;
          break;

        case "bottom":
          top = rect.bottom + 8;
          left = rect.left + rect.width / 2;
          break;

        case "left":
          top = rect.top + rect.height / 2;
          left = rect.left - 8;
          break;

        case "right":
          top = rect.top + rect.height / 2;
          left = rect.right + 8;
          break;
      }

      setPosition({
        top,
        left,
      });
    };

    updatePosition();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, placement]);

  if (!content || disabled) {
    return children;
  }

  const tooltip = open ? (
    <div
      role="tooltip"
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        maxWidth: maxWidth ?? 300,
        transform:
          placement === "bottom"
            ? "translateX(-50%)"
            : placement === "top"
              ? "translate(-50%, -100%)"
              : placement === "left"
                ? "translate(-100%, -50%)"
                : "translateY(-50%)",
      }}
      className={cn(
        "z-[99999] w-max rounded bg-tooltip-background px-2 py-2 text-[14px] font-medium text-tooltip-foreground shadow-tooltip",
        className,
      )}
    >
      {content}

      {showArrow && (
        <div
          className={cn(
            "absolute h-2 w-2 rotate-45 bg-tooltip-background",
            PLACEMENT_STYLES[placement].arrow,
          )}
        />
      )}
    </div>
  ) : null;

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-flex"
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
      >
        {children}
      </span>

      {createPortal(tooltip, document.body)}
    </>
  );
}
