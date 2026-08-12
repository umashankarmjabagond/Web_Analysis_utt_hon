import React from "react";
import { XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Badge from "../badge/Badge";

export type NotificationType = "success" | "danger" | "warning" | "info";

interface NotificationProps {
  type: NotificationType;
  message: string;
  title?: string;
  onClose?: () => void;
  width?: number | string; // dynamic width, defaults to 400px like the Figma design
}

const SuccessIcon: React.FC<{ className?: string; size?: number }> = ({
  className,
  size = 14,
}) => (
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
    label: "Success",
    icon: SuccessIcon,
  },

  danger: {
    label: "Failure",
    icon: XCircle,
  },

  warning: {
    label: "Warning",
    icon: AlertTriangle,
  },

  info: {
    label: "Info",
    icon: Info,
  },
};

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  title,
  onClose,
  width = 400,
}) => {
  const { t } = useTranslation();
  const { label, icon: Icon } = TYPE_CONFIG[type];

  return (
    <div
      style={{ width: typeof width === "number" ? `${width}px` : width }}
      className="flex flex-col h-auto rounded-[10px] p-6 gap-6 bg-toast-background shadow-toast"
    >
      <div className="flex flex-col w-full gap-4">
        {/* Badge & Close */}
        <div className="flex flex-row w-full items-center justify-between h-8">
          {/* Badge/Categorical */}
          <Badge
            variant={type}
            size="md"
            fill="solid"
            icon={<Icon size={14} />}
          >
            {t(`NOTIFICATION_${label.toUpperCase()}`)}
          </Badge>
          <X
            onClick={onClose}
            size={16}
            strokeWidth={1.5}
            className="text-text-accent cursor-pointer"
          />
        </div>

        {/* Body content */}
        <div className="flex flex-col w-full gap-3">
          <p className="text-[16px] leading-6 font-bold m-0 text-toast-title">
            {title ?? t(`NOTIFICATION_${label.toUpperCase()}`)}
          </p>
          <p
            className={`text-[14px] leading-5 font-medium m-0 text-toast-description`}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notification;
