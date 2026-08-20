import React, { useEffect } from "react";
import { XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Badge from "../badge/Badge";
import type {
  NotificationProps,
  NotificationType,
} from "../../../types/commonTypes";

const SuccessIcon: React.FC<{
  className?: string;
  size?: number;
}> = ({ className, size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12.75 6.20143V6.75343C12.7493 8.04729 12.3303 9.30624 11.5556 10.3425C10.7809 11.3788 9.69197 12.1369 8.45121 12.5038C7.21046 12.8706 5.88435 12.8266 4.67068 12.3782C3.45701 11.9298 2.42079 11.1011 1.71658 10.0157C1.01236 8.93025 0.677875 7.64627 0.763006 6.35522C0.848137 5.06417 1.34832 3.83523 2.18897 2.85168C3.02961 1.86813 4.16567 1.18266 5.42771 0.897522C6.68975 0.61238 8.01016 0.742836 9.192 1.26943M12.75 1.95343L6.75 7.95943L4.95 6.15943"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TYPE_CONFIG: Record<
  NotificationType,
  {
    label: string;
    icon: React.ElementType;
  }
> = {
  success: {
    label: "COMMON_SUCCESS",
    icon: SuccessIcon,
  },
  danger: {
    label: "COMMON_FAILURE",
    icon: XCircle,
  },
  warning: {
    label: "COMMON_WARNING",
    icon: AlertTriangle,
  },
  info: {
    label: "COMMON_INFO",
    icon: Info,
  },
};

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  title,
  onClose,
  width = 400,
  duration = 6000,
}) => {
  const { t } = useTranslation();

  const { label, icon: Icon } = TYPE_CONFIG[type];

  useEffect(() => {
    if (!onClose || duration <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose, duration]);

  return (
    <div
      style={{
        width: typeof width === "number" ? `${width}px` : width,
      }}
      className="flex flex-col h-auto rounded-[10px] p-6 gap-6 bg-toast-background shadow-toast"
    >
      {/* Badge & Close */}
      <div className="flex items-center justify-between">
        <Badge variant={type} size="md" fill="solid" icon={<Icon size={14} />}>
          {t(`${label.toUpperCase()}`)}
        </Badge>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification"
            className="flex items-center justify-center"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Body content */}
      <div className="flex w-full flex-col gap-0.5">
        <p className="m-0 text-[16px] font-bold leading-6 text-toast-title">
          {title ?? t(`${label.toUpperCase()}`)}
        </p>

        <p className="m-0 text-[14px] font-medium leading-5 text-toast-description">
          {message}
        </p>
      </div>
    </div>
  );
};

export default Notification;
