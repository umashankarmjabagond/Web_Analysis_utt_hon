import React, { type InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./Input.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  showPasswordToggle?: boolean;
}

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
    <div className={`input-wrapper dark ${fullWidth ? "input-full" : ""}`}>
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}

      <div className="input-container">
        <input
          type={inputType}
          className={`
            common-input
            ${error ? "input-error" : ""}
            ${
              type === "password" && showPasswordToggle
                ? "input-password"
                : ""
            }
            ${className}
          `}
          {...props}
        />

        {type === "password" && showPasswordToggle && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {helperText && !error && (
        <div className="input-helper">
          {helperText}
        </div>
      )}

      {error && (
        <div className="input-error-text">
          {error}
        </div>
      )}
    </div>
  );
};

export default Input;