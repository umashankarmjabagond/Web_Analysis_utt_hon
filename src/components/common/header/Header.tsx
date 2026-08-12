import { CircleQuestionMark, Menu, Settings, User } from "lucide-react";

export default function Header() {
  return (
    <header className="h-14 bg-[#272727] flex items-center justify-between px-5">
      <div className="flex items-center gap-3">
        <button className="text-foreground-secondary hover:text-color-foreground cursor-pointer">
          <Menu size={20} />
        </button>

        <h1 className="text-foreground-strong font-semibold tracking-wide">
          Honeywell
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="text-foreground h-8 w-8 rounded-[4px] bg-surface-elevated flex items-center justify-center border border-border-inverse cursor-pointer hover:bg-surface-hover hover:border-border-default">
          <CircleQuestionMark size={16} className="text-foreground" />
        </button>

        <button className="text-foreground h-8 w-8 rounded-[4px] bg-surface-elevated flex items-center justify-center border border-border-inverse cursor-pointer hover:bg-surface-hover hover:border-border-default">
          <Settings size={16} className="text-foreground" />
        </button>

        <button className="text-foreground h-8 w-8 rounded-full bg-surface-elevated flex items-center justify-center border border-border-inverse cursor-pointer hover:bg-surface-hover hover:border-border-default">
          <User size={16} className="text-foreground" />
        </button>
      </div>
    </header>
  );
}
