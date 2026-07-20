import type { ReactNode } from "react";

export const NOTIFICATION_TYPE = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

export interface NotificationProps {
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export interface DialogProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
  width?: number | string;
}
