import React, { type InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  showPasswordToggle?: boolean;
}

const variants = {
  default: `
    border-[var(--color-border)]
    hover:border-[var(--color-text-secondary)]
    focus:border-[var(--color-primary)]
  `,
  error: `
    border-[var(--color-danger)]
    hover:border-[var(--color-danger)]
    focus:border-[var(--color-danger)]
  `,
};

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  error,
  helperText,
  fullWidth = true,
  showPasswordToggle = false,
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" && showPassword ? "text" : type;

  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label className="text-[var(--text-sm)] font-[var(--font-medium)] text-[var(--color-text-primary)]">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type={inputType}
          className={`
            w-full
            h-8
            rounded-[var(--radius-sm)]
            border
            bg-[var(--color-surface)]
            px-2.5
            pr-${type === "password" && showPasswordToggle ? "9" : "2.5"}
            text-[var(--text-sm)]
            font-normal
            text-[var(--color-text-primary)]
            placeholder:text-[var(--color-text-disabled)]
            outline-none
            transition-colors
            ${error ? variants.error : variants.default}
            ${className}
          `}
          {...props}
        />

        {type === "password" && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center justify-center text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

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

export default Input;