import type {
  BadgeFill,
  BadgeProps,
  BadgeSize,
  BadgeType,
  BadgeVariant,
} from "../../../types/commonTypes";
import { cn } from "../../../utils/utils";

const variants: Record<BadgeVariant, Record<BadgeFill, string>> = {
  neutral: {
    solid:
      "bg-badge-neutral-solid-background border-badge-neutral-solid-border text-badge-neutral-solid-foreground",
    outline:
      "bg-badge-neutral-outline-background border-badge-neutral-outline-border text-badge-neutral-outline-foreground",
  },

  success: {
    solid:
      "bg-badge-success-solid-background border-badge-success-solid-border text-badge-success-solid-foreground",
    outline:
      "bg-badge-success-outline-background border-badge-success-outline-border text-badge-success-outline-foreground",
  },

  warning: {
    solid:
      "bg-badge-warning-solid-background border-badge-warning-solid-border text-badge-warning-solid-foreground",
    outline:
      "bg-badge-warning-outline-background border-badge-warning-outline-border text-badge-warning-outline-foreground",
  },

  danger: {
    solid:
      "bg-badge-danger-solid-background border-badge-danger-solid-border text-badge-danger-solid-foreground",
    outline:
      "bg-badge-danger-outline-background border-badge-danger-outline-border text-badge-danger-outline-foreground",
  },

  info: {
    solid:
      "bg-badge-info-solid-background border-badge-info-solid-border text-badge-info-solid-foreground",
    outline:
      "bg-badge-info-outline-background border-badge-info-outline-border text-badge-info-outline-foreground",
  },
};

const sizes: Record<BadgeSize, string> = {
  xs: "h-4 px-1.5 text-[10px]",
  sm: "h-5 px-2 text-xs",
  md: "h-6 px-2.5 text-sm",
  lg: "h-7 px-3 text-base",
};

const typeStyles: Record<BadgeType, string> = {
  categorical: "uppercase",
  numeric: "h-5 min-w-5 px-1.5 text-[11px] font-bold text-xs",
};

const baseStyles =
  "inline-flex items-center justify-center gap-1 rounded-full border font-medium whitespace-nowrap";

export default function Badge({
  type = "categorical",
  variant,
  size = "md",
  fill = "solid",
  icon,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        baseStyles,
        variants[variant][fill],
        sizes[size],
        typeStyles[type],
        className,
      )}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
}
