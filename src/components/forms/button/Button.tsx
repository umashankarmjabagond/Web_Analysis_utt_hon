import React, { type ButtonHTMLAttributes } from "react";
import "./Button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

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
        common-btn
        btn-${variant}
        btn-${size}
        ${fullWidth ? "btn-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <span className="btn-spinner"></span>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="btn-icon">{icon}</span>
          )}

          <span>{children}</span>

          {icon && iconPosition === "right" && (
            <span className="btn-icon">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
