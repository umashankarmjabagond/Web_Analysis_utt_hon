import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { AccordionProps } from "../../../types/commonTypes";

export default function Accordion({
  title,
  count,
  children,
  defaultOpen = true,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded bg-app-surface-tertiary p-3 shadow-sm">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between"
      >
        {/* Left */}
        <span className="text-[14px] leading-5 font-medium text-button-secondary">{title}</span>

        {/* Right */}
        <div className="flex items-center gap-2">
          {count !== undefined && (
            <div className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-app-background-light px-1 text-[11px] font-semibold text-app-code-background">
              {count}
            </div>
          )}

          {isOpen ? (
            <ChevronDown size={16} className="text-text-muted-light" />
          ) : (
            <ChevronRight size={16} className="text-text-muted-light" />
          )}
        </div>
      </button>

      {isOpen && <div className="mt-3 grid grid-cols-3 gap-2">{children}</div>}
    </div>
  );
}
