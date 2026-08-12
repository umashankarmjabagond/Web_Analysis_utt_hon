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
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded bg-accordion-background p-3">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between transition-colors bg-accordion-header-background text-accordion-header-foreground"
      >
        {/* Left */}
        <span className="text-[14px] leading-5 font-medium">{title}</span>

        {/* Right */}
        <div className="flex items-center gap-2">
          {count !== undefined && (
            <Badge type="numeric" variant="neutral" size="sm">
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

      {isOpen && <div className="mt-3 grid grid-cols-3 gap-2">{children}</div>}
    </div>
  );
}
