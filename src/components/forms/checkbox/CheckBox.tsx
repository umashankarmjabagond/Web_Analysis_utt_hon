import React from "react";
import { Check } from "lucide-react";
import type { CheckboxProps } from "../../../types/commonTypes";
import { cn } from "../../../utils/utils";

const variants = {
  default:
    "border-checkbox-border bg-checkbox-background hover:border-checkbox-hover-border",

  checked: "border-checkbox-checked-border bg-checkbox-checked-background",

  disabled:
    "border-checkbox-disabled-border bg-checkbox-disabled-background cursor-not-allowed",
};

const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  disabled = false,
  label,
  className = "",
  size = 16,
  labelClassName = "",
  ...props
}) => {
  const variant = disabled ? "disabled" : checked ? "checked" : "default";

  return (
    <label className="flex items-center gap-2">
      {/* Checkbox only */}
      <span
        className="relative flex shrink-0 items-center justify-center"
        style={{
          width: size,
          height: size,
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          style={{
            width: size,
            height: size,
          }}
          className={cn(
            "peer cursor-pointer appearance-none rounded-xs border",
            "outline-none transition-colors",
            variants[variant],
            "checked:focus:ring-1 checked:focus:ring-checkbox-focus-ring",
            className,
          )}
          {...props}
        />

        <Check
          strokeWidth={3}
          className="pointer-events-none absolute h-3 w-3 text-checkbox-checkmark opacity-0 peer-checked:opacity-100"
        />
      </span>

      {/* Label outside fixed-size checkbox */}
      {label && (
        <span className={cn("text-sm text-foreground", labelClassName)}>
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;
