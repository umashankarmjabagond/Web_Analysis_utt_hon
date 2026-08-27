import { Timer, X } from "lucide-react";
import type { DialogProps } from "../../../types/commonTypes";
import { cn } from "../../../utils/utils";

const Dialog = ({
  isOpen,
  title,
  subtitle,
  icon,
  children,
  onClose,
  width = 600,
  variant = "default",
}: DialogProps) => {
  if (!isOpen) return null;

  const isConnections = variant === "connections";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dialog-overlay p-4">
      <div
        className={cn(
          "relative flex max-h-[90vh] flex-col overflow-hidden rounded-xl",
          "border border-dialog-border",
          "bg-[#111111] text-dialog-foreground",
          "shadow-dialog-shadow",
        )}
        style={{ width }}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-start justify-between",
            isConnections ? "px-8 pb-5 pt-7" : "p-8 pb-6",
          )}
        >
          {!isConnections && (
            <div className="flex items-center gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#454545] border-[1.5px] border-[#454545]">
                {icon ?? (
                  <Timer
                    size={20}
                    strokeWidth={1.8}
                    className="text-foreground-secondary"
                  />
                )}
              </div>

              <div>
                <h2 className="text-4xl font-semibold text-dialog-title">
                  {title}
                </h2>

                {subtitle && (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-dialog-description">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          )}

          {isConnections && (
            <div className="flex items-center gap-3">
              {icon && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-elevated">
                  {icon}
                </div>
              )}

              <div className="flex flex-col">
                <h2 className="text-[20px] font-extrabold leading-[30px] tracking-normal text-dialog-title">
                  {title}
                </h2>

                {subtitle && (
                  <p className="mt-0 text-[12px] font-medium leading-4 tracking-normal text-[var(--gray-350)] normal-case">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex cursor-pointer items-center justify-center rounded-md p-2 text-foreground-secondary transition-colors hover:bg-surface-hover hover:text-foreground-strong"
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
