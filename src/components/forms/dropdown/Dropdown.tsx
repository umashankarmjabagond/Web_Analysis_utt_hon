import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../utils/utils";
import Button from "../../forms/button/Button";
import type { DropdownItem, DropdownProps } from "../../../types/commonTypes";

export default function Dropdown({
  items,
  onSelect,
  placeholder,
  className,
  menuClassName,
  itemClassName,
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (item: DropdownItem) => {
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative inline-block">
      {/* Trigger */}
      <Button
        type="button"
        variant="primary"
        fill="outline"
        size="medium"
        onClick={() => setIsOpen((prev) => !prev)}
        icon={<ChevronDown size={15} />}
        iconPosition="right"
        className={cn(
          "h-[34px] w-[112px]",
          "justify-center",
          "whitespace-nowrap",
          "text-sm font-normal",
          "rounded-sm",
          className,
        )}
      >
        {placeholder ?? t("COMMON_SELECT")}
      </Button>

      {/* Menu */}
      {isOpen && (
        <div
          className={cn(
            "absolute right-0 top-full z-[9999] mt-2",
            menuClassName,
          )}
        >
          {items.map((item) => (
            <div
              key={item.value}
              onClick={() => handleSelect(item)}
              className={cn(
                "flex w-full h-full ",
                "rounded-none",
                "text-sm font-normal",

                itemClassName,
              )}
            >
              {item.icon && <span>{item.icon}</span>}

              <span className="whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
