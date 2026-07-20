interface ToolbarButtonProps {
  icon: React.ReactNode;
  active?: boolean;
  title: string;
  onClick?: () => void;
}

export default function ToolbarButton({
  icon,
  active,
  title,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`
        h-7
        w-7
        rounded
        flex
        items-center
        justify-center
        transition-all
        duration-150
        ${
          active
            ? "bg-[#2F7DBD] text-white"
            : "text-[#D5D5D5] hover:bg-[#404040]"
        }
      `}
    >
      {icon}
    </button>
  );
}
