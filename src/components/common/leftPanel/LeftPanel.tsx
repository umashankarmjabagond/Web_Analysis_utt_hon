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
    <aside className="w-[300px] overflow-hidden rounded-md bg-[#2b2b2b]">
      {panel.component}
    </aside>
  );
}
