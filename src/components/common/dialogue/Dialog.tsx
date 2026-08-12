import { X } from "lucide-react";
import type { DialogProps } from "../../../types/commonTypes";
import { cn } from "../../../utils/utils";

const Dialog = ({
  isOpen,
  title,
  subtitle,
  children,
  onClose,
  width = 600,
}: DialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dialog-overlay p-4">
      <div
        className={cn(
          "relative flex max-h-[80vh] flex-col overflow-hidden rounded-xl",
          "border border-dialog-border",
          "bg-dialog-background text-dialog-foreground",
          "shadow-dialog-shadow",
        )}
        style={{ width }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-8 pb-6">
          <div>
            {subtitle && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-dialog-description">
                {subtitle}
              </p>
            )}

            <h2 className="text-4xl font-semibold text-dialog-title">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center rounded-md p-2 text-foreground-secondary cursor-pointer transition-colors hover:bg-surface-hover hover:text-foreground-strong"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">{children}</div>
      </div>
    </div>
  );
};

export default Dialog;
