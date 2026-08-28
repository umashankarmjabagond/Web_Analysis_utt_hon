import { useMemo, useState, type ElementType, type FC } from "react";
import { Search } from "lucide-react";
import { cn } from "../../../utils/utils";

export interface AttributeSelectorItem {
  id: string;
  label: string;
  icon?: ElementType;
  value: unknown;
}

export interface AttributeSelectorProps {
  items: AttributeSelectorItem[];
  onSelect: (item: AttributeSelectorItem) => void;
  placeholder?: string;
  className?: string;
}

const AttributeSelector: FC<AttributeSelectorProps> = ({
  items,
  onSelect,
  placeholder = "Search attributes...",
  className,
}) => {
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((item) => item.label.toLowerCase().includes(query));
  }, [items, search]);

  return (
    <div
      className={cn(
        "flex max-h-[70vh] w-full flex-col overflow-y-auto",
        className,
      )}
    >
      {/* Search section */}
      <div
        className="
          flex
          h-[49px]
          w-[254px]
          items-center
          border-b
          border-[#454545]
          p-[8px]
        "
      >
        <div
          className="
            flex
            h-[32px]
            w-[238px]
            items-center
            gap-3
            rounded-[6px]
            border-2
            border-[#64C3FF]
            bg-[#2E2E2E]
            px-3
          "
        >
          <Search
            size={20}
            strokeWidth={2}
            className="shrink-0 text-[#B0B0B0]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={placeholder}
            className="
              h-full
              w-full
              bg-transparent
              text-[14px]
              text-app-text-primary
              outline-none
              placeholder:text-[#B0B0B0]
            "
          />
        </div>
      </div>

      {/* Attribute list */}
      <div className="flex flex-col py-2">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            className="
              flex
              min-h-[50px]
              w-full
              cursor-pointer
              items-center
              gap-5
              px-8
              text-left
              text-app-text-primary
              transition-colors
              hover:bg-[#2E2E2E]
            "
          >
            {item.icon && (
              <span className="flex w-8 shrink-0 items-center justify-center text-[#D0D0D0]">
                {item.icon}
              </span>
            )}

            <span className="text-[18px] font-medium leading-6">
              {item.label}
            </span>
          </button>
        ))}

        {filteredItems.length === 0 && (
          <div className="px-8 py-6 text-sm text-[#909090]">
            No attributes found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AttributeSelector;
