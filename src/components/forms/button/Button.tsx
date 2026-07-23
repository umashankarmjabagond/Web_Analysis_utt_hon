import React, { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const variants = {
  primary:
    "border border-[#64C3FF] bg-[#64C3FF] !text-[#303030] hover:bg-[#5ABEF7] hover:border-[#5ABEF7]",

  secondary:
    "border border-[#62BBF3] bg-[#404040] !text-[#64C3FF] hover:bg-[#4A4A4A] hover:text-[#62BBF3]",

  danger:
    "border border-[var(--color-danger)] bg-[var(--color-danger)] text-white hover:brightness-90",

  success:
    "border border-[var(--color-success)] bg-[var(--color-success)] text-white hover:brightness-90",
};

const sizes = {
  small: "min-w-[72px] h-[26px] px-[10px] text-[var(--text-xs)]",
  medium: "min-w-[88px] h-[30px] px-[14px] text-[var(--text-sm)]",
  large: "min-w-[110px] h-[36px] px-[18px] text-[var(--text-base)]",
};

const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  disabled = false,
  fullWidth = false,
  variant = "secondary",
  size = "medium",
  icon,
  iconPosition = "left",
  className = "",
  type = "button",
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-1.5
        cursor-pointer
        box-border
        rounded-[var(--radius-sm)]
        font-[var(--font-medium)]
        transition-all duration-200
        active:translate-y-px
        disabled:cursor-not-allowed
        disabled:opacity-50
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-[#62BBF3]

        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <span className="h-[14px] w-[14px] animate-spin rounded-full border-2 border-current border-r-transparent" />
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
