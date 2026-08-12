import React from "react";
import { ChevronDown } from "lucide-react";
import type { SelectProps } from "../../../types/commonTypes";
import { cn } from "../../../utils/utils";

const selectVariants = {
  default: cn(
    "border-select-border",
    "hover:border-select-hover-border",
    // "focus:border-select-focus-border",
    // "focus:ring-1 focus:ring-select-focus-ring",
  ),

  error: cn(
    "border-select-error-border",
    "hover:border-select-error-border",
    // "focus:border-select-error-border",
    // "focus:ring-1 focus:ring-select-error-ring",
  ),

  disabled: cn(
    "border-select-disabled-border",
    "bg-select-disabled-background",
    "text-select-disabled-foreground",
    "cursor-not-allowed",
    "hover:border-select-disabled-border",
  ),
};

const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  fullWidth,
  options,
  placeHolder,
  className = "",
  ...props
}) => {
  const variant = props.disabled ? "disabled" : error ? "error" : "default";

  return (
    <div
      className={cn(
        "relative flex shrink-0 flex-col gap-1.5",
        fullWidth && "w-full",
      )}
    >
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}

      <div className="relative min-w-0">
        <select
          className={cn(
            "h-8 appearance-none rounded-sm border",
            fullWidth ? "w-full" : "w-auto",
            "bg-select-background px-2.5 pr-8",
            "text-sm font-normal text-select-foreground",
            "outline-none transition-colors",
            selectVariants[variant],
            className,
          )}
          {...props}
        >
          {placeHolder && (
            <option value="" disabled hidden>
              {placeHolder}
            </option>
          )}

          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          className={cn(
            "pointer-events-none absolute right-2 top-1/2 -translate-y-1/2",
            props.disabled ? "text-select-icon-disabled" : "text-select-icon",
          )}
        />
      </div>

      {!error && helperText && (
        <p className="text-xs text-foreground-secondary">{helperText}</p>
      )}

      {error && <p className="text-xs text-select-error-foreground">{error}</p>}
    </div>
  );
};

export default Select;
