import { useLocation } from "react-router-dom";
import { panelConfig } from "../leftPanel/panelConfig";
import TopTabs from "../../../app/layouts/Workspace/TopTabs";

export default function WorkspaceHeader() {
  const location = useLocation();

  const panel = panelConfig.find((item) =>
    location.pathname.startsWith(item.path),
  );

  return (
    <div className="flex h-14 gap-2">
      <div className="flex w-[300px] items-center rounded-md bg-[#2b2b2b] px-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
          {panel?.header}
        </h2>
      </div>

      <div className="flex flex-1 items-center overflow-x-auto rounded-md bg-[#2b2b2b]">
        <TopTabs />
      </div>
    </div>
  );
}
