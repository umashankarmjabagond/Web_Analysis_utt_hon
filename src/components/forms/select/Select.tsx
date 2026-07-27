import React from "react";
import { ChevronDown } from "lucide-react";
import type { SelectProps } from "../../../types/commonTypes";


const variants = {
  default: `
    border-[var(--color-border-1)]
    hover:border-[var(--color-text-secondary)]
    focus:border-[var(--color-primary)]
  `,
  error: `
    border-[var(--color-danger)]
    hover:border-[var(--color-danger)]
    focus:border-[var(--color-danger)]
  `,
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
  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label className="text-[var(--text-sm)] font-[var(--font-medium)] text-[var          (--color-text-primary)]">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
                        w-full
                        h-8
                        appearance-none
                        rounded-[var(--radius-sm)]
                        border
                        px-2.5
                        pr-8
                        text-[var(--text-sm)]
                        font-normal
                        text-[var(--color-text-primary)]
                        outline-none
                        transition-colors
                        ${error ? variants.error : variants.default}
                        ${className}
                    `}
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
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
        />
      </div>

      {!error && helperText && (
        <p className="text-[var(--text-xs)] text-[var--color-text-secondary)]">
          {helperText}
        </p>
      )}

      {error && (
        <p className="text-[var(--text-xs)] text-[var(--color-danger)]">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
