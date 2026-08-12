import { useLocation } from "react-router-dom";
import { panelConfig } from "../leftPanel/panelConfig";
import TopTabs from "../../../app/layouts/Workspace/TopTabs";
import { useTranslation } from "react-i18next";

export default function WorkspaceHeader() {
  const location = useLocation();

  const { t } = useTranslation();

  const panel = panelConfig.find((item) =>
    location.pathname.startsWith(item.path),
  );

  return (
    <div className="flex h-14 gap-2">
      <div className="flex w-[320px] items-center rounded-md bg-[#272727] px-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
          {panel ? t(panel.header) : ""}
        </h2>
      </div>

      <div className="flex flex-1 items-center overflow-x-auto rounded-md bg-[#272727]">
        <TopTabs />
      </div>
    </div>
  );
}
