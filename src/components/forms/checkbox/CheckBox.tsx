import React from "react";
import { Check } from "lucide-react";
import type { CheckboxProps } from "../../../types/commonTypes";

const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  disabled = false,
  label,
  className = "",
  ...props
}) => {
  return (
    <label className="flex items-center gap-2">
      <div className="relative flex h-4 w-4 items-center justify-center shrink-0">
        <input
          type="checkbox"
          checked={checked}
          className={`
          peer
          h-4
          w-4
          appearance-none
          rounded-xs
          border
          border-app-default-border
          bg-transparent
          cursor-pointer

          checked:border-app-action-primary
          checked:bg-app-action-primary

          disabled:cursor-not-allowed
          disabled:opacity-50
          ${className}
        `}
          {...props}
        />

        <Check
          strokeWidth={3}
          className="pointer-events-none absolute h-3 w-3 text-black opacity-0 peer-checked:opacity-100"
        />

        {label && (
          <span className="text-sm text-app-text-primary">{label}</span>
        )}
      </div>
    </label>
  );
};

export default Checkbox;
