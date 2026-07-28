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
    <div className="rounded bg-[#4B4B4B] p-3 shadow-sm">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between"
      >
        {/* Left */}
        <span className="text-[13px] font-medium text-[#F5F5F5]">{title}</span>

        {/* Right */}
        <div className="flex items-center gap-2">
          {count !== undefined && (
            <div className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#E5E5E5] px-1 text-[11px] font-semibold text-[#2B2B2B]">
              {count}
            </div>
          )}

          {isOpen ? (
            <ChevronDown size={16} className="text-[#D4D4D4]" />
          ) : (
            <ChevronRight size={16} className="text-[#D4D4D4]" />
          )}
        </div>
      </button>

      {isOpen && <div className="mt-3 grid grid-cols-3 gap-2">{children}</div>}
    </div>
  );
}
