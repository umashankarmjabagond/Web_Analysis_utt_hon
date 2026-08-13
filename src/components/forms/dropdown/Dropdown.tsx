import { useState, useRef, useEffect, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../utils/utils";

export interface DropdownItem {
  label: string;
  value: string;
  icon?: ReactNode;
}

interface DropdownProps {
  items: DropdownItem[];
  onSelect: (item: DropdownItem) => void;
  placeholder?: string;
  className?: string;
}

export default function Dropdown({
  items,
  onSelect,
  placeholder,
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: DropdownItem) => {
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      className={cn("relative inline-block cursor-pointer", className)}
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex cursor-pointer items-center gap-1",
          "text-sm text-dropdown-trigger-foreground",
          "transition-colors",
          "hover:text-dropdown-trigger-hover-foreground",
        )}
      >
        <span>{placeholder ?? t("COMMON_SELECT")}</span>

        <ChevronDown
          size={15}
          className={cn(
            "text-dropdown-trigger-icon transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Menu */}
      {isOpen && (
        <div
          className={cn(
            "absolute -left-30 top-full z-50 mt-2 w-64",
            "overflow-hidden rounded-md border",
            "border-dropdown-border",
            "bg-dropdown-background",
            "shadow-dropdown",
            "lg:left-auto lg:right-0",
          )}
        >
          {items.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleSelect(item)}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2",
                "px-4 py-3 text-left text-sm",
                "bg-dropdown-item-background",
                "text-dropdown-item-foreground",
                "transition-colors",
                "hover:bg-dropdown-item-hover-background",
                "hover:text-dropdown-item-hover-foreground",
              )}
            >
              {item.icon && (
                <span className="text-dropdown-icon">{item.icon}</span>
              )}

              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
