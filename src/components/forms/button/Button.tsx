import React, { type ButtonHTMLAttributes } from "react";
import { cn } from "../../../utils/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  fill?: "solid" | "outline";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const variants = {
  primary: {
    solid: cn(
      "bg-button-primary-solid-background",
      "border-button-primary-solid-border",
      "text-button-primary-solid-foreground",
      "hover:bg-button-primary-solid-hover-background",
      "hover:border-button-primary-solid-hover-border",
      "active:bg-button-primary-solid-active-background",
      "active:border-button-primary-solid-active-border",
    ),
    outline: cn(
      "bg-button-primary-outline-background",
      "border-button-primary-outline-border",
      "text-button-primary-outline-foreground",
      "hover:bg-button-primary-outline-hover-background",
      "hover:border-button-primary-outline-hover-border",
      "active:bg-button-primary-outline-active-background",
      "active:border-button-primary-outline-active-border",
    ),
  },

  secondary: {
    solid: cn(
      "bg-button-secondary-background",
      "border-button-secondary-border",
      "text-button-secondary-foreground",
      "hover:bg-button-secondary-hover-background",
      "hover:border-button-secondary-hover-border",
      "active:bg-button-secondary-active-background",
      "active:border-button-secondary-active-border",
    ),
    outline: cn(
      "bg-button-secondary-outline-background",
      "border-button-secondary-outline-border",
      "text-button-secondary-outline-foreground",
      "hover:bg-button-secondary-outline-hover-background",
      "hover:border-button-secondary-outline-hover-border",
      "active:bg-button-secondary-outline-active-background",
      "active:border-button-secondary-outline-active-border",
    ),
  },

  success: {
    solid: cn(
      "bg-button-success-solid-background",
      "border-button-success-solid-border",
      "text-button-success-solid-foreground",
      "hover:bg-button-success-solid-hover-background",
      "hover:border-button-success-solid-hover-border",
      "active:bg-button-success-solid-active-background",
      "active:border-button-success-solid-active-border",
    ),
    outline: cn(
      "bg-button-success-outline-background",
      "border-button-success-outline-border",
      "text-button-success-outline-foreground",
      "hover:bg-button-success-outline-hover-background",
      "active:bg-button-success-outline-active-background",
    ),
  },

  warning: {
    solid: cn(
      "bg-button-warning-solid-background",
      "border-button-warning-solid-border",
      "text-button-warning-solid-foreground",
      "hover:bg-button-warning-solid-hover-background",
      "hover:border-button-warning-solid-hover-border",
      "active:bg-button-warning-solid-active-background",
      "active:border-button-warning-solid-active-border",
    ),
    outline: cn(
      "bg-button-warning-outline-background",
      "border-button-warning-outline-border",
      "text-button-warning-outline-foreground",
      "hover:bg-button-warning-outline-hover-background",
      "active:bg-button-warning-outline-active-background",
    ),
  },

  danger: {
    solid: cn(
      "bg-button-danger-solid-background",
      "border-button-danger-solid-border",
      "text-button-danger-solid-foreground",
      "hover:bg-button-danger-solid-hover-background",
      "hover:border-button-danger-solid-hover-border",
      "active:bg-button-danger-solid-active-background",
      "active:border-button-danger-solid-active-border",
    ),
    outline: cn(
      "bg-button-danger-outline-background",
      "border-button-danger-outline-border",
      "text-button-danger-outline-foreground",
      "hover:bg-button-danger-outline-hover-background",
      "active:bg-button-danger-outline-active-background",
    ),
  },
};

const sizes = {
  small: "min-w-[72px] h-[26px] px-[10px] text-xs",
  medium: "min-w-[88px] h-[30px] px-[14px] text-sm",
  large: "min-w-[110px] h-[36px] px-[18px] text-base",
};

const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  disabled = false,
  fullWidth = false,
  variant = "secondary",
  fill = "solid",
  size = "medium",
  icon,
  iconPosition = "left",
  className = "",
  type = "button",
  onClick,
  ...props
}) => {
  const variantStyles = variants[variant][fill];

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-1.5",
        "box-border rounded-sm",
        "font-medium",
        "transition-colors duration-200",
        "cursor-pointer",
        "active:translate-y-px",
        "focus-visible:outline-2",
        "focus-visible:outline-offset-2",
        "focus-visible:outline-button-focus-ring",
        "disabled:cursor-not-allowed",
        "disabled:bg-button-disabled-background",
        "disabled:border-button-disabled-border",
        "disabled:text-button-disabled-foreground",
        fullWidth && "w-full",
        sizes[size],
        variantStyles,
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && <span>{icon}</span>}

          <span>{children}</span>

          {icon && iconPosition === "right" && <span>{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
