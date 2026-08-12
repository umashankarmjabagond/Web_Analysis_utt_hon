import React from "react";
import type { TextAreaProps } from "../../../types/commonTypes";
import { cn } from "../../../utils/utils";

const variants = {
  default:
    "border-textarea-border hover:border-textarea-hover-border focus:border-textarea-focus-border focus:ring-1 focus:ring-textarea-focus-ring",

  error:
    "border-textarea-error-border hover:border-textarea-error-border focus:border-textarea-error-border focus:ring-1 focus:ring-textarea-error-ring",

  disabled:
    "border-textarea-disabled-border bg-textarea-disabled-background text-textarea-disabled-foreground hover:border-textarea-disabled-border cursor-not-allowed",
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
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}

      <textarea
        rows={rows}
        className={cn(
          "w-full rounded-sm border px-2.5 py-2",
          "bg-textarea-background text-sm font-normal text-textarea-foreground",
          "placeholder:text-textarea-placeholder",
          "outline-none transition-colors resize-none",
          variants[props.disabled ? "disabled" : error ? "error" : "default"],
          className,
        )}
        {...props}
      />

      {!error && helperText && (
        <p className="text-xs text-foreground-secondary">{helperText}</p>
      )}

      {error && (
        <p className="text-xs text-textarea-error-foreground">{error}</p>
      )}
    </div>
  );
};

export default TextArea;
