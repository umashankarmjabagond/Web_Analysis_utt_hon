import { X } from "lucide-react";
import type { DialogProps } from "../../../types/commonTypes";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        className="relative rounded-xl bg-[#3C3C3C] shadow-2xl"
        style={{ width }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-8 pb-0">
          <div>
            {subtitle && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gray-300">
                {subtitle}
              </p>
            )}

            <h2 className="text-4xl font-semibold text-white">{title}</h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default Dialog;
