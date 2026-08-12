import { useLocation } from "react-router-dom";
import { panelConfig } from "./panelConfig";
import { useTranslation } from "react-i18next";
export default function LeftPanel() {
  const location = useLocation();
  const { t } = useTranslation();
  const panel = panelConfig.find((item) =>
    location.pathname.startsWith(item.path),
  );

  if (!panel) {
    return null;
  }

  return (
    <aside className="w-[320px]  p-4 overflow-y-auto rounded-md bg-[#2b2b2b] flex flex-col gap-2">
      <h3>{t(panel.header)}</h3>
      {panel.component}
    </aside>
  );
}
