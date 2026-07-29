import { useState, useRef, useEffect, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

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
  placeholder = "Select",
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

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
      className={`cursor-pointer relative inline-block ${className}`}
    >
      {/* Trigger */}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="cursor-pointer flex items-center gap-1 text-sm text-[#55AFFF] hover:text-white transition-colors"
      >
        <span>{placeholder}</span>

        <ChevronDown
          size={15}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Menu */}

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-md border border-[#4A4A4A] bg-[#2F2F2F] shadow-xl">
          {items.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleSelect(item)}
              className="cursor-pointer flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-white transition-colors hover:bg-[#3C3C3C]"
            >
              {item.icon}

              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
