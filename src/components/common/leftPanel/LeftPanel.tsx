import { useLocation } from "react-router-dom";
import { panelConfig } from "./panelConfig";
export default function LeftPanel() {
  const location = useLocation();
  const panel = panelConfig.find((item) =>
    location.pathname.startsWith(item.path),
  );

  if (!panel) {
    return null;
  }

  return (
    <aside className="w-[300px] p-3 overflow-y-auto flex flex-col bg-surface-primary border-r border-[#454545]">
      {panel.component}
    </aside>
  );
}
