import { Bell, Menu, Settings, UserCircle2 } from "lucide-react";

export default function Header() {
  return (
    <header className="h-14 bg-[#262626] border-b border-neutral-700 flex items-center justify-between px-5">
      <div className="flex items-center gap-3">
        <button className="text-gray-300 hover:text-white">
          <Menu size={20} />
        </button>

        <h1 className="text-white font-semibold tracking-wide">Honeywell</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-white">
          <Bell size={18} />
        </button>

        <button className="text-gray-400 hover:text-white">
          <Settings size={18} />
        </button>

        <button className="text-gray-400 hover:text-white">
          <UserCircle2 size={22} />
        </button>
      </div>
    </header>
  );
}
