import type {
  ComponentType,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  ButtonHTMLAttributes,
} from "react";
import type { DonutChartItem } from "./dashboardTypes";

export interface BreadcrumbItem {
  id: string;
  label: string;
  image?: string;
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

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
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void;
}
export interface TreeNodeData {
  id: string;
  label: string;
  image?: string;
  children?: TreeNodeData[];
}

export interface TreeProps {
  nodes: TreeNodeData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export interface TreeNodeProps {
  node: TreeNodeData;
  level: number;
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
  renderContent?: boolean;
}

export interface DonutChartProps {
  data: DonutChartItem[];
  size?: number | undefined;
  colors: Record<string, string>;
}

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: SelectOption[];
  placeHolder?: string;
}

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  size?: "sm" | "md" | "lg";
}

type BadgeVariant = "neutral" | "success" | "warning" | "error" | "info";
type BadgeSize = "xs" | "sm" | "md" | "lg";
type BadgeAppearance = "solid" | "outline";

export interface BadgeProps {
  variant: BadgeVariant;
  size?: BadgeSize;
  fill?: BadgeAppearance;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export interface GroupedSelectorItem {
  id: string;
  label: string;
  icon?: ReactNode;
  value?: unknown;
}

export interface GroupedSelectorSection {
  id: string;
  title: string;
  items: GroupedSelectorItem[];
}

export interface GroupedSelectorProps {
  placeholder?: string;
  sections: GroupedSelectorSection[];
  onSelect: (item: GroupedSelectorItem) => void;
  disabled?: boolean;
  className?: string;
}
