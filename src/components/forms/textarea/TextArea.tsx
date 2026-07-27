import React from "react";
import type { TextAreaProps } from "../../../types/commonTypes";


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

const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helperText,
  fullWidth = true,
  rows = 4,
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label className="text-[var(--text-sm)] font-[var(--font-medium)] text-[var(--color-text-primary)]">
          {label}
        </label>
      )}

      <textarea
        rows={rows}
        className={`
          w-full
          rounded-[var(--radius-sm)]
          border
          px-2.5
          py-2
          text-[var(--text-sm)]
          font-normal
          text-[var(--color-text-primary)]
          placeholder:text-[var(--color-text-disabled)]
          outline-none
          resize-none
          transition-colors
          ${error ? variants.error : variants.default}
          ${className}
        `}
        {...props}
      />

      {!error && helperText && (
        <p className="text-[var(--text-xs)] text-[var(--color-text-secondary)]">
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

export default TextArea;