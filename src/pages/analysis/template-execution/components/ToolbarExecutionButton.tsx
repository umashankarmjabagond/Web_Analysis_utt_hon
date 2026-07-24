interface ToolbarButtonProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function ToolbarExecutionButton({
  icon: Icon,
  label,
  active = false,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex h-8 w-[102px] items-center gap-2 rounded-[4px] px-2 py-1.5 text-[14px] cursor-pointer ${
        active ? "text-app-action-primary" : "text-app-action-secondary"
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}
