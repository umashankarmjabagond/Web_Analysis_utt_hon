import { useRef, useState, type FC } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import clsx from "clsx";
import type {
  GroupedSelectorItem,
  GroupedSelectorProps,
} from "../../../types/commonTypes";

const GroupedSelector: FC<GroupedSelectorProps> = ({
  placeholder = "Select an option",
  sections,
  onSelect,
  disabled = false,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(true); // Open by default like Figma

  const handleSelect = (item: GroupedSelectorItem) => {
    onSelect(item);
    setIsOpen(false);
  };

  const hasItems = sections.some((section) => section.items.length > 0);

  return (
    <div ref={containerRef} className={clsx("w-full", className)}>
      <div className="rounded-md bg-component-toolbar-divider">
        {/* Header */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={clsx(
            "flex h-11 w-full items-center justify-between rounded-md border border-component-active-border bg-tab-active-bg px-4 text-left text-[15px] text-white outline-none",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <span>{placeholder}</span>

          {isOpen ? (
            <ChevronUp size={18} className="text-white" />
          ) : (
            <ChevronDown size={18} className="text-white" />
          )}
        </button>

        {/* Body */}
        {isOpen && (
          <div className="mt-4 p-4">
            {!hasItems ? (
              <div className="px-4 py-3 text-sm text-gray-300">
                No options available
              </div>
            ) : (
              sections.map((section) => (
                <div key={section.id} className="mb-6">
                  <h3 className="mb-4 px-2 text-[15px] font-semibold text-text-light">
                    {section.title}
                  </h3>

                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item)}
                        className="flex w-full items-center gap-4 rounded-md px-6 py-[10px] text-left transition hover:bg-app-surface-background"
                      >
                        <FileText
                          size={16}
                          strokeWidth={1.8}
                          className="text-text-soft-white"
                        />

                        <span className="text-[14px] text-text-soft-white">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupedSelector;
