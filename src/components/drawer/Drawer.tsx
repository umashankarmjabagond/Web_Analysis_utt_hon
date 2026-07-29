import { X } from "lucide-react";
import { type ReactNode, useEffect } from "react";

interface DrawerProps {
  opened: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: ReactNode | string;
  footer?: ReactNode;
  position?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  bodyClassName?: string;
  className?: string;
  closeOnOverlayClick?: boolean;
}

const drawerSizes = {
  sm: "320px",
  md: "420px",
  lg: "560px",
  xl: "680px",
  full: "100%",
};

const positionClasses = {
  left: {
    panel: "left-0 top-0 h-full",
    open: "translate-x-0",
    close: "-translate-x-full",
  },
  right: {
    panel: "right-0 top-0 h-full",
    open: "translate-x-0",
    close: "translate-x-full",
  },
  top: {
    panel: "left-0 top-0 w-full",
    open: "translate-y-0",
    close: "-translate-y-full",
  },
  bottom: {
    panel: "bottom-0 left-0 w-full",
    open: "translate-y-0",
    close: "translate-y-full",
  },
};

const Drawer = ({
  opened,
  onClose,
  children,
  title,
  footer,
  position = "bottom",
  size = "md",
  bodyClassName = "",
  className = "",
  closeOnOverlayClick = false,
}: DrawerProps) => {
  useEffect(() => {
    const handleKeyDown = ({ key }: KeyboardEvent) =>
      key === "Escape" && onClose();

    if (opened) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [opened, onClose]);

  const isSideDrawer = position === "left" || position === "right";

  const drawerStyle = isSideDrawer
    ? { width: drawerSizes[size] }
    : { height: drawerSizes[size], maxHeight: "calc(100% - 16px)" };

  const { panel, open, close } = positionClasses[position];

  return (
    <>
      <div
        onClick={() => closeOnOverlayClick && onClose()}
        className={`absolute inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          opened ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      <div
        style={drawerStyle}
        className={`dark absolute ${panel} ${opened ? open : close} z-50 flex flex-col border border-[var(--app-divider)] bg-[var(--color-table-header)] text-[var(--color-text-primary)] shadow-2xl transition-transform duration-300 ${className}`}
      >
        {title && (
          <div className="flex shrink-0 items-center border border-[var(--app-divider)] bg-[var(--background-primary-container)]">
            <div className="min-w-0 flex-1 overflow-hidden">
              {typeof title === "string" ? (
                <h2 className="px-4 py-3 text-lg font-semibold">{title}</h2>
              ) : (
                title
              )}
            </div>

            <button
              onClick={onClose}
              aria-label="Close drawer"
              className="
                flex
                h-[34px]
                w-[32px]
                shrink-0
                items-center
                justify-center
                p-2
                text-[var(--color-text-secondary)]
                transition-colors
                hover:bg-[var(--color-surface)]
                hover:text-[var(--color-primary)]
                "
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        )}

        <div
          className={`flex flex-1 flex-col overflow-hidden ${bodyClassName}`}
        >
          {children}
        </div>

        {footer && (
          <div className="shrink-0 border-t border-[var(--color-border)] px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </>
  );
};

export default Drawer;
