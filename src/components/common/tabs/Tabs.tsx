import type { TabsProps } from "../../../types/commonTypes";

export function Tabs({ items, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex flex-wrap">
      {items.map((item) => (
        <button
          key={item.id}
          className={`p-2 mx-1 cursor-pointer border-b-2 border-transparent ${activeTab === item.id && " border-b-amber-400"}`}
          onClick={() => onTabChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
