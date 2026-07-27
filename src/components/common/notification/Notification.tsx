import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'failure' | 'warning' | 'info';

interface NotificationProps {
  type: NotificationType;
  message: string;
  title?: string;
  onClose?: () => void;
}


const TYPE_CONFIG: Record<
  NotificationType,
  { label: string; icon: React.ElementType; bgClass: string }
> = {
  success: { label: 'Success', icon: CheckCircle2, bgClass: 'bg-success' },
  failure: { label: 'Failure', icon: XCircle, bgClass: 'bg-danger' },
  warning: { label: 'Warning', icon: AlertTriangle, bgClass: 'bg-warning' },
  info: { label: 'Info', icon: Info, bgClass: 'bg-info' },
};

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  title,
  onClose,
}) => {
  const { label, icon: Icon, bgClass } = TYPE_CONFIG[type];

  return (
    <div className="flex flex-col w-[400px] h-auto rounded-[10px] p-6 gap-6 bg-toast-bg">
      {/* Header+Body */}
      <div className="flex flex-col w-full gap-4">
        {/* Badge & Close */}
        <div className="flex flex-row w-full items-center justify-between h-8">
          {/* Badge/Categorical */}
          <div
            className={`flex flex-row items-center gap-1 h-6 rounded-2xl px-2 py-1 ${bgClass}`}
          >
            <Icon size={12} strokeWidth={1.5} className="text-badge-icon" />
            <span className="text-[12px] leading-4 font-bold uppercase text-white">
              {label}
            </span>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification"
            className="flex items-center justify-center w-8 h-8 rounded p-2 bg-transparent hover:bg-white/5"
          >
            <X size={12} strokeWidth={1.5} className="text-text-accent" />
          </button>
        </div>

        {/* Body content */}
        <div className="flex flex-col w-full gap-3">
          <p className="text-[16px] leading-6 font-bold m-0 text-toast-title">
            {title ?? label}
          </p>
          <p className="text-[14px] leading-5 font-medium m-0 text-text-accent">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notification;
