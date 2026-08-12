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
    <div className="flex items-center gap-2">
      {items.map((item, index) => {
        const Icon = item.image
          ? iconMap[item.image as keyof typeof iconMap]
          : null;

        return (
          <div
            key={`${item.label}-${index}`}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              className="flex items-center gap-1 rounded px-1 text-sm text-breadcrumb-foreground transition-colors hover:text-breadcrumb-hover-foreground"
              onClick={() => onItemClick?.(item, index)}
            >
              {Icon && <Icon size={14} />}
            </button>

            {index < items.length - 1 && (
              <ChevronRight size={14} className="text-breadcrumb-separator" />
            )}
          </div>
        );
      })}
    </div>
  );
}
