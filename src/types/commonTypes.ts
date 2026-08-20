import type {
  ComponentType,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
} from "react";
import type { DonutChartItem } from "./dashboardTypes";
import type { LucideIcon } from "lucide-react";

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
  WARNING: "warning",
  INFO: "info",
  DANGER: "danger",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

export interface NotificationProps {
  type: NotificationType;
  message: string;
  title?: string;
  onClose?: () => void;
  width?: number | string;
  duration?: number;
}

export interface DialogProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
  width?: number | string;
  variant?: "default" | "connections";
}

export interface AccordionProps {
  title: string;
  count?: number;
  children: ReactNode;
  defaultOpen?: boolean;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export interface TemplateCardProps {
  title: string;
  icon?: LucideIcon;
  draggable?: boolean;
  onDragStart?: React.DragEventHandler<HTMLDivElement>;
  onClick?: () => void;
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
  size?: number;
  colors: Record<string, string>;
  className?: string;
}


export interface LegendItem {
  name: string;
  value: number;
  fill: string;
}

export interface CustomLegendProps {
  data: LegendItem[];
  width: number;
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

export type BadgeVariant =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info";
export type BadgeSize = "xs" | "sm" | "md" | "lg";
export type BadgeFill = "solid" | "outline";
export type BadgeType = "categorical" | "numeric";

export interface BadgeProps {
  type?: BadgeType;
  variant: BadgeVariant;
  size?: BadgeSize;
  fill?: BadgeFill;
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
  icon?: LucideIcon;
  onSelect: (item: GroupedSelectorItem) => void;
  disabled?: boolean;
  className?: string;
}

export interface TooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  disabled?: boolean;
  maxWidth?: number | string;
  showArrow?: boolean;
  className?: string;
}

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  label?: string;
  size?: number;
  labelClassName?: string;
}
export type CellValue = string | number | boolean | null | undefined;

export interface SpreadsheetProps {
  data: Array<Record<string, CellValue>> | CellValue[][];
}

export interface DropdownItem {
  label: string;
  value: string;
  icon?: ReactNode;
}

export interface DropdownProps {
  items: DropdownItem[];
  onSelect: (item: DropdownItem) => void;
  placeholder?: string;
  className?: string;
  menuClassName?: string;
  itemClassName?: string;
}
