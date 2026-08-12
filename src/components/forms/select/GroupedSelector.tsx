import { useRef, useState, type FC } from "react";
import { ChevronDown, FileText } from "lucide-react";
import type {
  GroupedSelectorItem,
  GroupedSelectorProps,
} from "../../../types/commonTypes";
import { cn } from "../../../utils/utils";

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
    <div ref={containerRef} className={cn("w-full", className)}>
      <div className="rounded-md bg-component-toolbar-divider">
        {/* Header */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-md border px-4",
            "bg-select-background text-left text-sm text-select-foreground",
            "outline-none transition-colors",
            "hover:border-select-hover-border",
            "focus:border-select-focus-border focus:ring-1 focus:ring-select-focus-ring",
            isOpen && "border-select-open-border bg-select-open-background",
            disabled && [
              "cursor-not-allowed",
              "border-select-disabled-border",
              "bg-select-disabled-background",
              "text-select-disabled-foreground",
            ],
          )}
        >
          <span>{placeholder}</span>

          <ChevronDown
            size={18}
            className={cn(
              "text-select-icon transition-transform duration-200",
              isOpen && "rotate-180",
              disabled && "text-select-icon-disabled",
            )}
          />
        </button>

        {/* Body */}
        {isOpen && (
          <div className="mt-4 p-4 bg-select-option-background">
            {!hasItems ? (
              <div className="px-4 py-3 text-sm text-select-option-disabled-foreground">
                No options available
              </div>
            ) : (
              sections.map((section) => (
                <div key={section.id} className="mb-6 last:mb-0">
                  <h3 className="mb-4 px-2 text-[15px] font-semibold text-select-option-group-foreground">
                    {section.title}
                  </h3>

                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item)}
                        className={cn(
                          "flex w-full items-center gap-4 rounded-md px-6 py-2.5",
                          "text-left text-sm text-select-option-foreground",
                          "transition-colors",
                          "hover:bg-select-option-hover-background",
                          "hover:text-select-option-hover-foreground",
                          disabled &&
                            "cursor-not-allowed text-select-option-disabled-foreground",
                        )}
                      >
                        <FileText
                          size={16}
                          strokeWidth={1.8}
                          className="shrink-0 text-select-icon"
                        />

                        <span className="text-[14px] text-foreground">
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
