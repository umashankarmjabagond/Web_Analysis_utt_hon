import type { ComponentType, ReactNode } from "react";

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

export interface AccordionProps {
  title: string;
  count?: number;
  children: ReactNode;
  defaultOpen?: boolean;
}

export interface TemplateCardProps {
  title: string;
  draggable?: boolean;
  onClick?: () => void;
}
export interface TreeNodeData {
  id: string;
  label: string;
  children?: TreeNodeData[];
}

export interface TreeProps {
  nodes: TreeNodeData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export interface TreeNodeProps {
  node: TreeNodeData;
  expandedIds: Set<string>;
  selectedId: string | null;
  onToggle: (nodeId: string) => void;
  onSelect: (nodeId: string) => void;
}

export interface TabItem {
  id: string;
  label: string;
  component?: ComponentType;
  path?: string;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeTab?: string | null;
  onTabChange?: (id: string) => void;
  variant?: "primary" | "secondary";
}
