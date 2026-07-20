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
    <div className="rounded-md bg-[#4A4A4A] p-3">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm text-white">{title}</span>

          {count !== undefined && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-black">
              {count}
            </div>
          )}
        </div>

        {isOpen ? (
          <ChevronDown size={18} className="text-white" />
        ) : (
          <ChevronRight size={18} className="text-white" />
        )}
      </button>

      {isOpen && <div className="mt-3 grid grid-cols-3 gap-3">{children}</div>}
    </div>
  );
}
