import { X } from "lucide-react";
import { type ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/utils";

type DrawerVariant = "overlay" | "panel";
interface DrawerProps {
  variant?: DrawerVariant;
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
  variant = "overlay",
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
  const isOverlay = variant === "overlay";
  useEffect(() => {
    if (!isOverlay) return;

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

  const drawerStyle = isOverlay
    ? isSideDrawer
      ? { width: drawerSizes[size] }
      : { height: drawerSizes[size], maxHeight: "calc(100% - 16px)" }
    : undefined;

  const { panel, open, close } = positionClasses[position];
  const { t } = useTranslation();

  return (
    <>
      {isOverlay && (
        <div
          onClick={() => closeOnOverlayClick && onClose()}
          className={cn(
            "absolute inset-0 z-40 transition-opacity duration-300",
            "bg-drawer-overlay",
            opened ? "visible opacity-100" : "invisible opacity-0",
          )}
        />
      )}

      <div
        style={drawerStyle}
        className={cn(
          "dark flex flex-col bg-drawer-background text-drawer-foreground shadow-drawer transition-transform duration-300",
          isOverlay
            ? `absolute ${panel} ${opened ? open : close} z-50`
            : "relative w-full",
          className,
        )}
      >
        {title && (
          <div className="flex shrink-0 items-center border border-drawer-header-border bg-drawer-header-background">
            <div className="min-w-0 flex-1 overflow-hidden">
              {typeof title === "string" ? (
                <h2 className="px-4 py-3 text-lg font-semibold text-drawer-header-foreground">
                  {title}
                </h2>
              ) : (
                title
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={t("COMMON_CLOSE")}
              className={cn(
                "flex h-[34px] w-8 shrink-0 cursor-pointer items-center justify-center p-2",
                "text-drawer-close-foreground transition-colors",
                "hover:bg-drawer-close-hover-background",
                "hover:text-drawer-close-hover-foreground",
              )}
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        )}

        <div
          className={cn("flex flex-1 flex-col overflow-hidden", bodyClassName)}
        >
          {children}
        </div>

        {footer && (
          <div className="shrink-0 border-t border-drawer-footer-border px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </>
  );
};

export default Drawer;
