import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useState,
} from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../../utils/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  showPasswordToggle?: boolean;
  startAdornment?: ReactNode;
}
const inputVariants = {
  default: cn(
    "border-input-border",
    "hover:border-input-hover-border",
    "focus:border-input-focus-border",
    "focus:ring-1 focus:ring-input-focus-ring",
  ),

  error: cn(
    "border-input-error-border",
    "hover:border-input-error-border",
    "focus:border-input-error-border",
    "focus:ring-1 focus:ring-input-error-ring",
  ),

  disabled: cn(
    "border-input-disabled-border",
    "bg-input-disabled-background",
    "text-input-disabled-foreground",
    "cursor-not-allowed",
    "hover:border-input-disabled-border",
  ),
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      type = "text",
      error,
      helperText,
      fullWidth = true,
      showPasswordToggle = false,
      className = "",
      startAdornment,
      ...props
    },
    ref,
  ) => {
    const variant = props.disabled ? "disabled" : error ? "error" : "default";

    const [showPassword, setShowPassword] = useState(false);

    const inputType = type === "password" && showPassword ? "text" : type;

    return (
      <div className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label className="text-sm font-medium text-foreground">{label}</label>
        )}

        <div className="relative flex items-center">
          {startAdornment && (
            <span className="absolute left-2 text-input-icon-foreground transition-colors hover:text-input-icon-hover-foreground">
              {startAdornment}
            </span>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "h-8 w-full rounded-sm border",
              "bg-input-background px-2.5",
              type === "password" && showPasswordToggle ? "pr-9" : "pr-2.5",
              "text-sm font-normal text-input-foreground",
              "placeholder:text-input-placeholder",
              "outline-none transition-colors",
              inputVariants[variant],
              className,
            )}
            {...props}
          />

          {type === "password" && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center justify-center text-input-icon-foreground transition-colors hover:text-input-icon-hover-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {!error && helperText && (
          <p className="text-xs text-foreground-secondary">{helperText}</p>
        )}

        {error && (
          <p className="text-xs text-input-error-foreground">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
