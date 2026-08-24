import { Timer, X } from "lucide-react";
import type { DialogProps } from "../../../types/commonTypes";
import { cn } from "../../../utils/utils";

const Dialog = ({
  isOpen,
  title,
  subtitle,
  children,
  onClose,
  width = 600,
  className,
  titleClassName,
  subtitleClassName,
  headerClassName,
  closeButtonClassName,
}: DialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dialog-overlay p-4">
      <div
        className={cn(
          "relative flex max-h-[90vh] flex-col overflow-hidden rounded-xl",
          "border border-dialog-border",
          "bg-[#111111] text-dialog-foreground",
          "shadow-dialog-shadow",
          className,
        )}
        style={{ width }}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-start justify-between p-8 pb-6",
            headerClassName,
          )}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#454545] border-[1.5px] border-[#454545]">
              <Timer
                size={20}
                strokeWidth={1.8}
                className="text-foreground-secondary"
              />
            </div>

            <div>
              <h2
                className={cn(
                  "text-4xl font-semibold text-dialog-title",
                  titleClassName,
                )}
              >
                {title}
              </h2>

              {subtitle && (
                <p
                  className={cn(
                    "mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-dialog-description",
                    subtitleClassName,
                  )}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={cn(
              "flex cursor-pointer items-center justify-center rounded-md p-2 text-foreground-secondary transition-colors hover:bg-surface-hover hover:text-foreground-strong",
              closeButtonClassName,
            )}
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 px-8 pb-8">{children}</div>
      </div>
    </div>
  );
};

export default Dialog;
