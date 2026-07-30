import type { BadgeProps } from "../../../types/commonTypes";

const variants = {
  neutral: {
    solid:
      "bg-app-badge-neutral-background text-app-badge-neutral-text border border-transparent",
    outline:
      "bg-transparent border border-app-badge-neutral-outline text-app-badge-neutral-outline",
  },
  success: {
    solid:
      "bg-app-badge-success-background text-app-badge-success-text border border-transparent",
    outline:
      "bg-transparent border border-app-badge-success-outline text-app-badge-success-outline",
  },
  warning: {
    solid:
      "bg-app-badge-warning-background text-app-badge-warning-text border border-transparent",
    outline:
      "bg-transparent border border-app-badge-warning-outline text-app-badge-warning-outline",
  },
  error: {
    solid:
      "bg-app-badge-error-background text-app-badge-error-text border border-transparent",
    outline:
      "bg-transparent border border-app-badge-error-outline text-app-badge-error-outline",
  },
  info: {
    solid:
      "bg-app-badge-info-background text-app-badge-info-text border border-transparent",
    outline:
      "bg-app-surface-elevated border border-app-badge-info-outline text-app-badge-info-outline",
  },
};

const sizes = {
  xs: "h-4 px-1.5 text-[10px]",
  sm: "h-5 px-2 text-xs",
  md: "h-6 px-2.5 text-sm",
  lg: "h-7 px-3 text-base",
};

const baseStyles =
  "inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap";

export default function Badge({
  variant,
  size = "md",
  fill = "solid",
  icon,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={`${baseStyles} ${variants[variant][fill]} ${sizes[size]} ${className ?? ""}`}
    >
      <span className="">
        {icon && <span className="mr-1">{icon}</span>}
        {children}
      </span>
    </span>
  );
}
