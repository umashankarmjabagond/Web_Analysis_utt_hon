import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { AccordionProps } from "../../../types/commonTypes";
import { cn } from "../../../utils/utils";
import Badge from "../../common/badge/Badge";

export default function Accordion({
  title,
  count,
  children,
  defaultOpen = true,
  icon,
  subtitle,
  action,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const enhanced =
    icon !== undefined || subtitle !== undefined || action !== undefined;

  // accordian for template
  if (!enhanced) {
    return (
      <div className="rounded bg-accordion-background p-3">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex w-full cursor-pointer items-center justify-between transition-colors bg-accordion-header-background text-accordion-header-foreground"
        >
          <span className="text-[14px] leading-5 font-medium">{title}</span>

          <div className="flex items-center gap-2">
            {count !== undefined && (
              <Badge
                className="bg-accordion-list-count"
                type="numeric"
                variant="neutral"
                size="sm"
              >
                {count}
              </Badge>
            )}

            <ChevronDown
              size={16}
              className={cn(
                "text-accordion-expander transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            />
          </div>
        </button>

        {isOpen && (
          <div className="mt-3 grid grid-cols-3 gap-2">{children}</div>
        )}
      </div>
    );
  }

  // Connections accordion
  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-[6px]
        border
        border-border-gray
        bg-[var(--background-primary-container)]
      "
    >
      {/* Header */}
      <div
        className="
          flex
          min-h-[56px]
          w-full
          items-center
          justify-between
          gap-3
          bg-surface-emphasis
          px-3
          py-[10px]
        "
      >
        {/* Left */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
        >
          {icon && (
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-[6px]
                border
                border-border-gray
                bg-surface-primary
              "
            >
              {icon}
            </div>
          )}

          <div className="min-w-0">
            <div className="truncate text-[13px] font-bold leading-[19.5px] tracking-normal text-app-text-primary">
              {title}
            </div>

            {subtitle && (
              <div className="truncate text-[12px] font-medium leading-4 tracking-normal text-[var(--gray-350)]">
                {subtitle}
              </div>
            )}
          </div>
        </button>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-[6px]">
          {action && (
            <div
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              {action}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Collapse" : "Expand"}
            className="
              flex
              h-[34px]
              w-6
              cursor-pointer
              items-center
              justify-center
              text-[var(--gray-350)]
            "
          >
            <ChevronDown
              size={16}
              strokeWidth={2}
              className={cn(
                "transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            />
          </button>
        </div>
      </div>

      {isOpen && <div className="h-px w-full bg-border-gray" />}

      {/* Content */}
      {isOpen && (
        <div
          className={cn("w-full bg-surface-emphasis px-3 pb-[10px] pt-[10px]")}
        >
          {children}
        </div>
      )}
    </div>
  );
}
