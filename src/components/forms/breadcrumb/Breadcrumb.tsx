import { ChevronRight } from "lucide-react";
import type { BreadcrumbProps } from "../../../types/commonTypes";

import { iconMap } from "../../../utils/iconMapper";

export default function Breadcrumb({
  items = [],
  onItemClick,
}: BreadcrumbProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-white">
      {items.map((item, index) => {
        const Icon =
          item.icon
            ? iconMap[
                item.icon as keyof typeof iconMap
              ]
            : null;

        return (
          <div
            key={`${item.label}-${index}`}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              className="flex items-center gap-1 rounded px-1 transition-colors hover:text-blue-400"
              onClick={() =>
                onItemClick?.(item, index)
              }
            >
              {Icon && <Icon size={14} />}
            </button>

            {index < items.length - 1 && (
              <ChevronRight size={14} />
            )}
          </div>
        );
      })}
    </div>
  );
}